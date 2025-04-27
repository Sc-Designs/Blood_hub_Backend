const verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }
    function cleanUser(user) {
      const {
        password,
        otp,
        otpExpiry,
        emergencycontact,
        gender,
        age,
        googleId,
        createdAt,
        updatedAt,
        __v,
        ...safeUser
      } = user._doc;
      return safeUser;
    }

    let user = await userModel.findOne({ email });
    const otp = Otp.OtpGenerator();

    if (!user) {
      const password = "password";
      const hashedPassword = await userModel.hashPassword(password);
      user = await userService.createUser({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry: new Date(Date.now() + 60 * 1000),
      });

      await user.save();

      await EmailSender.sendEmail({
        email: user.email,
        sub: "OTP Verification 📫",
        mess: emailTemplate.registerEmail(otp),
      });

      const cleanedUser = cleanUser(user);
      return res.status(201).json(cleanedUser);
    } else {
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 60 * 1000);
      await user.save();

      await EmailSender.sendEmail({
        email: user.email,
        sub: "🔢Login OTP🔢",
        mess: emailTemplate.loginEmail(otp),
      });

      const cleanedUser = cleanUser(user);
      return res.status(200).json(cleanedUser);
    }
  } catch (error) {
    console.error("Google token verify error:", error);
    return res.status(400).json({ error: "Invalid Google token" });
  }
};
