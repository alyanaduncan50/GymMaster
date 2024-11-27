<?php
session_start();
require '../connection.php'; // Include database connection

$name = $_SESSION['username'];
$sql = "SELECT * FROM users WHERE username ='$name'";

$result = mysqli_query($pdo, $sql);
$info = mysqli_fetch_assoc($result);

if(isset($_POST['updateAccInfo'])){
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['email'];
    $newUsername = $_POST['newUusername'];
    $membershipType = $_POST['membershipType'];

    $sql="UPDATE users SET first_name='$firstName', last_name='$lastName', email='$email', username='$newUsername',membership_type='$membershipType' WHERE username='$name'";

    $result2=mysqli_query($pdo, $sql);
    if($result2){
        header('location:profile.php');
    }
}

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title>GymMaster | Profile</title>
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link crossorigin href="https://fonts.gstatic.com" rel="preconnect" />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
    <link href="./assets/css/style.css" rel="stylesheet" />
    <link href="./assets/css/screens/profile.css" rel="stylesheet" />
    <link href="./assets/css/utilities.css" rel="stylesheet" />
    <link href="./assets/css/modules/table.css" rel="stylesheet" />
    <link href="./assets/css/modules/modal.css" rel="stylesheet" />
  </head>
  <body>
    <header class="header shadow">
        <div class="logo_container">
          <a href="/">
            <img src="./assets/img/logo.png" alt="GymMaster" class="logo mx-auto img-fluid"/>
          </a>
        </div>
    </header>
    <main>
        <div class="container" id="pageTitle">
            <h1>Profile</h1>
            <hr>
        </div>
        <br>
        <div class="container"  id="accountInfo">
            <h3>Basic Information</h3>
            <form class="editProfileForm" id="editProfileForm" method="POST">
                <div class="grid grid-cols-1 gap-lg">
                    <div class="grid grid-cols-2 gap-lg">
                        <div class="input-group">
                            <label class="label" for="firstName">First Name</label>
                            <input
                            class="form-control"
                            id="firstName"
                            name="firstName"
                            placeholder="Enter First Name"
                            type="text"
                            value="<?php echo "{$info['first_name']}" ?>"
                            />
                        </div>
                        <div class="input-group">
                            <label class="label" for="lastName">Last Name</label>
                            <input
                            class="form-control"
                            id="lastName"
                            name="lastName"
                            placeholder="Enter Last Name"
                            type="text"
                            value="<?php echo "{$info['last_name']}" ?>"
                            />
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-lg">
                    <div class="input-group">
                        <label class="label" for="email">Email Address</label>
                        <input
                        class="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter Email Address"
                        type="email"
                        value="<?php echo "{$info['email']}" ?>"
                        />
                    </div>
                    <div class="input-group">
                        <label class="label" for="newUsername">Username</label>
                        <input
                        class="form-control"
                        id="newUsername"
                        name="newUsername"
                        placeholder="Enter Username"
                        type="text"
                        value="<?php echo "{$info['username']}" ?>"
                        />
                    </div>
                    </div>
                </div>
                <div class="form-actions">
                    <input type="submit" class="btn btn-save" name="updateAccInfo" value="Save">
                </div>
            </form>
        </div>
        <br>
        <div class="container"  id="membershipInfo">
            <h3>Membership Type</h3>
            <form class="editProfileForm" id="editProfileForm" method="POST">    
                <div class="grid grid-cols-1 gap-lg">
                    <div class="input-group">
                        <label class="label" for="membershipType"
                        >Membership Type</label
                        >
                        <select
                        class="form-select"
                        id="membershipType"
                        name="membershipType"
                        >
                        <option value="basic" <?php echo $info['membership_type'] == 'basic' ? 'selected' : ''; ?>>Basic</option>
                        <option value="premium" <?php echo $info['membership_type'] == 'premium' ? 'selected' : ''; ?>>Premium</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <input type="submit" class="btn btn-save" name="updateAccInfo" value="Save">
                </div>
            </form>
        </div>
    </main>
</body>
</html>