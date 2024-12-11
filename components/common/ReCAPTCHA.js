import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../utils/constants";

const CustomReCAPTCHA = ({ onVerify }) => {
  const onReCAPTCHAChange = async (captchaCode) => {
      if (!captchaCode) {
          onVerify(false);
          return;
      }

      const verificationResponse = await fetch("/api/recaptcha", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ response: captchaCode }),
      });

      const verificationData = await verificationResponse.json();

      if (verificationData.success) {
          onVerify(true);
      } else {
          onVerify(false);
      }

      return;
  };

  return (
    <ReCAPTCHA
        size="normal"
        sitekey={RECAPTCHA_SITE_KEY}
        onChange={onReCAPTCHAChange}
    />
  )
}

export default CustomReCAPTCHA