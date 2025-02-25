export const getFirebaseError = (firebaseError: any, action: any) => {
  switch (firebaseError) {
    case "auth/user-disabled":
      action("Your account has been disabled by Admin.");
      break;
    case "INVALID_PHONE_NUMBER":
    case "auth/invalid-phone-number":
      action("Invalid phone number. Please enter a valid one.");
      break;
    case "QUOTA_EXCEEDED":
    case "auth/quota-exceeded":
      action("Too many requests. Please try again later.");
      break;
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
    case "auth/too-many-requests":
      action("Too many attempts. Please wait before trying again.");
      break;
    case "OPERATION_NOT_ALLOWED":
    case "auth/operation-not-allowed":
      action("Phone sign-in is not enabled. Please contact support.");
      break;
    case "auth/missing-verification-id":
      action("Verification ID is missing. Please request a new OTP.");
      break;
    case "auth/invalid-verification-id":
      action("Invalid verification ID. Please request a new OTP.");
      break;
    case "auth/missing-verification-code":
      action("Please enter the OTP.");
      break;
    case "auth/invalid-verification-code":
      action("Incorrect OTP. Please try again.");
      break;
    case "auth/code-expired":
      action("OTP has expired. Please request a new one.");
      break;
    case "auth/session-expired":
      action("Your session has expired. Please restart the login process.");
      break;
    case "auth/captcha-check-failed":
      action("reCAPTCHA verification failed. Please refresh and try again.");
      break;
    case "auth/account-exists-with-different-credential":
      action(
        "This phone number is linked to another account. Try signing in with a different method."
      );
      break;
    case "auth/credential-already-in-use":
      action("This phone number is already linked to another account.");
      break;
    default:
      action("OTP failed. Please try again.");
  }
};
