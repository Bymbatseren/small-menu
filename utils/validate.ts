interface ValidatePasswordProps {
  password: string;
  confirmPassword: string;
  setError: (error: string) => void;
}

export const validatePassword = ({
  password,
  confirmPassword,
  setError,
}: ValidatePasswordProps): boolean => {
  setError("");

  if (password.length < 6) {
    setError("Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой");
    return false;
  }

  if (password !== confirmPassword) {
    setError("Нууц үг таарахгүй байна");
    return false;
  }
  setError("");
  return true;
};