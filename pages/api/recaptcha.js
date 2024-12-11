export default async (req, res) => {
  const { response } = req.body;
  const secret_key = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

  const verificationResponse = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secret_key}&response=${response}`,
    }
  );

  const verificationData = await verificationResponse.json();
  res.status(200).json({ success: verificationData.success });
};