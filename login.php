<?php include 'config.php'; ?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <script>
      const BASE_URL = "<?php echo BASE_URL; ?>";
    </script>
    <meta charset="UTF-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title>GymMaster | Control Panel</title>
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link crossorigin href="https://fonts.gstatic.com" rel="preconnect" />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
    <link href="./assets/css/style.css" rel="stylesheet" />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      rel="stylesheet"
    />
    <link href="./assets/css/modules/modal.css" rel="stylesheet" />
    <link href="./assets/css/utilities.css" rel="stylesheet" />
    <link href="./assets/css/screens/login.css" rel="stylesheet" />
  </head>
  <body>
    <section class="flex items-center login">
      <div class="container">
        <div class="grid grid-rows-1">
          <form class="loginForm" method="POST">
            <div class="shadow login-card">
              <div class="logo_container border-b mx-auto p-3">
                <a href="/">
                  <img
                    alt="GymMaster"
                    class="logo mx-auto img-fluid"
                    src="./assets/img/logo.png"
                  />
                </a>
              </div>
              <div class="grid grid-cols-1 gap-lg p-5 pt-3">
                <div class="input-group">
                  <label class="label" for="username">Username </label>
                  <input
                    class="form-control"
                    id="username"
                    placeholder="Enter Username"
                    type="text"
                  />
                  <span class="error-message" id="username-error"></span>
                </div>
                <div class="input-group">
                  <label class="label" for="password">Password </label>
                  <input
                    class="form-control"
                    id="password"
                    placeholder="Enter Password"
                    type="password"
                  />
                  <span class="error-message" id="password-error"></span>
                </div>
              </div>
              <div class="px-5">
                <button class="btn btn-primary w-full" type="submit">
                  Login
                </button>
              </div>

              <div class="forgotPass">
                <span id="forgotPassModalTrigger">Forgot Password ?</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!--Forgot pass Modal -->

    <div class="modal-backdrop" id="forgotPassModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Reset Password</h2>
          <button class="close close-modal fa fa-close"></button>
        </div>
        <div
          class="alert alert-success"
          id="successMessage"
          role="alert"
          style="display: none"
        >
          Password has been sent to your email.
        </div>
        <div class="modal-body">
          <form id="forgotPassForm">
            <div>
              <div class="input-group">
                <label class="label" for="email">Email Address </label>
                <input
                  class="form-control"
                  id="email"
                  placeholder="Enter Email Address"
                  type="text"
                />
                <span class="error-message" id="email-error"></span>
              </div>
            </div>
            <div>
              <button class="btn btn-primary mt-2" type="submit">
                Get Verification Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <script src="assets/js/pages/login/login.js" type="module"></script>
  </body>
</html>
