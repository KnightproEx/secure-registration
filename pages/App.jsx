import { createRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import TextValidator from "react-material-ui-form-validator/lib/TextValidator";
import { ValidatorForm } from "react-material-ui-form-validator";
import {
  emailValidators,
  lowercaseRegex,
  max30CharsRegex,
  min10CharsRegex,
  noSpaceRegex,
  numericCharRegex,
  requiredValidators,
  specialCharRegex,
  uppercaseRegex,
  usernameValidators,
} from "../util/validator.js";
import ReCAPTCHA from "react-google-recaptcha";
import { Visibility, VisibilityOff, Close, Done } from "@mui/icons-material";
import { signUp } from "../repository/auth_repository";

const RuleText = (props) => {
  return (
    <Grid container>
      <Grid item>
        {props.pass ? <Done color="success" /> : <Close color="error" />}
      </Grid>
      <Grid item>
        <Typography color={props.pass ? "green" : "red"}>
          {props.message}
        </Typography>
      </Grid>
    </Grid>
  );
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailValidate, setEmailValidate] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameValidate, setUsernameValidate] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValidate, setPasswordValidate] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordValidate, setConfirmPasswordValidate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const recaptchaRef = createRef();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const disabled =
    !emailValidate ||
    !usernameValidate ||
    !passwordValidate ||
    !confirmPasswordValidate;

  ValidatorForm.addValidationRule(
    "isPassword",
    () =>
      validate.noSpace &&
      validate.min10 &&
      validate.max30 &&
      validate.lowercase &&
      validate.uppercase &&
      validate.numeric &&
      validate.special &&
      validate.sensitive
  );

  ValidatorForm.addValidationRule(
    "isPasswordMatch",
    (value) => value == password
  );

  const [validate, setValidate] = useState({
    noSpace: true,
    min10: false,
    max30: true,
    lowercase: false,
    uppercase: false,
    numeric: false,
    special: false,
    sensitive: true,
  });

  const noSensitiveChara = (value) => {
    const currentEmail = email
      .substring(0, email.lastIndexOf("@"))
      .split(".")
      .map((e) => e.toLowerCase());
    const currentPassword = value.toLowerCase();
    const currentUsername = username?.split(" ").map((e) => e.toLowerCase());
    const sensitiveChars = [...currentEmail, ...currentUsername].filter(
      (e) => e != ""
    );
    return !sensitiveChars.some((e) => currentPassword.includes(e));
  };

  const handleSetPassword = (e) => {
    const value = e.currentTarget.value;
    setPassword(value);
    setValidate({
      noSpace: value.match(noSpaceRegex),
      min10: value.match(min10CharsRegex),
      max30: value.match(max30CharsRegex),
      lowercase: value.match(lowercaseRegex),
      uppercase: value.match(uppercaseRegex),
      numeric: value.match(numericCharRegex),
      special: value.match(specialCharRegex),
      sensitive: noSensitiveChara(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    recaptchaRef.current.reset();
    const token = await recaptchaRef.current.executeAsync();
    setLoading(true);
    setError("");
    const error = await signUp(email, username, password, token);
    error ? setError(error) : setSnackbarOpen(true);
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        marginTop={8}
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h5" fontWeight="bold">
          Sign Up
        </Typography>
        <Container>
          <ValidatorForm onSubmit={handleSubmit}>
            <TextValidator
              fullWidth
              margin="normal"
              label="Email"
              value={email}
              withRequiredValidator
              onChange={(e) => setEmail(e.currentTarget.value)}
              validatorListener={setEmailValidate}
              validators={emailValidators.validators}
              errorMessages={emailValidators.errorMessages}
            />
            <TextValidator
              fullWidth
              margin="normal"
              label="Username"
              value={username}
              withRequiredValidator
              onChange={(e) => setUsername(e.currentTarget.value)}
              validatorListener={setUsernameValidate}
              validators={usernameValidators.validators}
              errorMessages={usernameValidators.errorMessages}
            />
            <Grid container pb={1}>
              <Grid item xs>
                <TextValidator
                  fullWidth
                  margin="normal"
                  label="Password"
                  type={!showPassword ? "password" : "text"}
                  value={password}
                  onChange={handleSetPassword}
                  validatorListener={setPasswordValidate}
                  withRequiredValidator
                  validators={[...requiredValidators.validators, "isPassword"]}
                  errorMessages={[
                    ...requiredValidators.errorMessages,
                    "Invalid password format.",
                  ]}
                />
              </Grid>
              <Grid item xs="auto" display="flex" alignItems="center">
                {/* TODO: show password icon*/}
                {/* <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton> */}
              </Grid>
            </Grid>
            <RuleText
              pass={validate.noSpace}
              message="Does not contain space."
            />
            <RuleText pass={validate.min10} message="Minimum 10 characters." />
            <RuleText pass={validate.max30} message="Maximum 30 characters." />
            <RuleText
              pass={validate.lowercase}
              message="At least 1 lowercase character."
            />
            <RuleText
              pass={validate.uppercase}
              message="At least 1 uppercase character."
            />
            <RuleText
              pass={validate.numeric}
              message="At least 1 numeric character."
            />
            <RuleText
              pass={validate.special}
              message="At least 1 special character."
            />
            <RuleText
              pass={validate.sensitive}
              message="Does not contain username/email."
            />
            <Grid container>
              <Grid item xs>
                <TextValidator
                  fullWidth
                  margin="normal"
                  label="Confirm password"
                  type={!showConfirmPassword ? "password" : "text"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                  validatorListener={setConfirmPasswordValidate}
                  withRequiredValidator
                  validators={[
                    ...requiredValidators.validators,
                    "isPasswordMatch",
                  ]}
                  errorMessages={[
                    ...requiredValidators.errorMessages,
                    "Password does not match",
                  ]}
                />
              </Grid>

              <Grid item xs="auto" display="flex" alignItems="center">
                {/* TODO: show icon*/}
                {/* <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton> */}
              </Grid>
            </Grid>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6Lf9L50fAAAAAEAtk-whHGpNc94YFSxFkQP8TiiZ"
              size="invisible"
            />
            <Box display="flex" flexDirection="column" alignItems="center">
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    sx={{ mt: 1 }}
                    disabled={disabled}
                  >
                    Sign Up
                  </Button>
                  <Typography color="error">{error}</Typography>
                </>
              )}
            </Box>
            <Snackbar
              open={snackbarOpen}
              onClose={() => setSnackbarOpen(false)}
              autoHideDuration={5000}
            >
              <Alert
                onClose={() => setSnackbarOpen(false)}
                severity="success"
                sx={{ width: "100%" }}
              >
                Account created successfully.
              </Alert>
            </Snackbar>
          </ValidatorForm>
        </Container>
      </Box>
    </Container>
  );
};

export default App;
