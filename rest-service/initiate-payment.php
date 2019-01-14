<?php

$requestData = json_decode(file_get_contents('php://input'), true);

$timestamp = time();

$requestData["timestamp"] = time();

$jsonFile = fopen($_SERVER["DOCUMENT_ROOT"]."/data.json", "a");

fwrite($jsonFile, json_encode($requestData));

fclose($jsonFile);

$response = array(
	"responseCode" => 0,
	"responseMessage" => "Operation Successful!"
);

$paymentLink = "https://13d15329.ngrok.io/complete-payment.php?timestamp=".$requestData["timestamp"];

$to = $requestData["email"];
$subject = "Payment Request from Ernest's Bar";
$txt = "Please follow the link below to continue your payment \n " . $paymentLink;
$headers = "From: webmaster@ernestsbar.com";

mail($to,$subject,$txt,$headers);

echo json_encode($response);exit();
