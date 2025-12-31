<?php
 

// define variables and set to empty values
//www.w3schools.com/php/php_form_url_email.asp
$nameErr = $emailErr = "";
$fname = $lname = $subject = $email = $gender = $message = "";


if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (empty($_POST["lname"])) {
    $nameErr = "Last Name is required";
  } else {
    $lname = ($_POST["lname"]);
    // check if name only contains letters and whitespace
    if (!preg_match("/^[a-zA-Z ]*$/",$lname)) {
      $nameErr = "Only letters and white space allowed"; 
    }
  }

  if (empty($_POST["email"])) {
    $emailErr = "Email is required";
  } else {
    $email = ($_POST["email"]);
    // check if e-mail address is well-formed
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $emailErr = "Invalid email format"; 
    }
  }
}
    $fname = $_POST['fname'];
    $subject = $_POST['subject'];
if ($email){
    $headers .="\r\nReply-To:$email";
} 
$message = 'Message: ' . $_POST['message'] . "\r\n";
$message .= 'Email: ' . $email . "\r\n";
$message .= 'Email2: ' . $_POST['email'] . "\r\n";
$message .= 'Name: ' . $_POST['fname'] . "\r\n";
$message .="From: ".$fname." <".$email."> \r\n";

$to = 'hello@r2ml.co, yll.agimi@gmail.com';


// Always set content-type when sending HTML email
//$headers .= 'From: <noreply@r2ml.co>' . "\r\n";
//$headers .= 'Cc: yll.agimi@gmail.com' . "\r\n";
 $headers = "Content-type: text/html; charset=".$encoding." \r\n";
$headers .= "From: ".$fname. ' ' . $lname." <".$email."> \r\n";
$headers .= "MIME-Version: 1.0 \r\n";
$headers .= "Content-Transfer-Encoding: 8bit \r\n";
$headers .= "Date: ".date("r (T)")." \r\n";

$status = mail($to, $subject, $message , $headers, '-fhello@r2ml.co');

if($status)
{echo"<script>
alert('Thank you for your email.');
window.location.href='index.html';
</script>";
} else { 
    echo '<p>Unable to process. <a href="https://r2ml.co/contact.html"> Please try again!</p>'; 
}


?>