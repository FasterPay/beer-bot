<?php 

$requestData = json_decode(file_get_contents('php://input'), true);

$jsonFile = fopen($_SERVER["DOCUMENT_ROOT"]."/pingbackdata.json", "r");

while(! feof($jsonFile)) {
	$line = json_decode(fgets($jsonFile), true);

	if($line["userOrder"]["email"] == $requestData["email"]){
		$paymentData = $line;
		break;
	}
}

$apiResponse = array(
	"responseCode" => 0,
	"responseMessage" => "Operation Successful!",
	"paymentData" => $paymentData
);

header("Content-Type: Application/json");
echo json_encode($apiResponse);exit();