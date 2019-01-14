<?php

include('fasterpay-php/lib/autoload.php');


$requestData = file_get_contents('php://input');
$pingbackData = json_decode($requestData, true);

$gateway = new FasterPay\Gateway(array(
	'publicKey' 	=> '<your-public-key>',
	'privateKey'	=> '<your-private-key>',
	'apiBaseUrl'	=> "https://pay.fasterpay.com/payment/form"
));

if(!empty($pingbackData)){

    if($gateway->pingback()->validate(
      array("apiKey" => $_SERVER["HTTP_X_APIKEY"]))
    ){
    	$orderId = $pingbackData["payment_order"]["merchant_order_id"];

    	$jsonFile = fopen($_SERVER["DOCUMENT_ROOT"]."/data.json", "r");

		while(! feof($jsonFile)) {
			$line = json_decode(fgets($jsonFile), true);

			if($line["timestamp"] == $orderId){
				$paymentData = $line;
				break;
			}
		}

		$orderData = array(
			"paymentOrder" => $pingbackData["payment_order"],
			"userOrder" => $paymentData
		);

		$file = fopen($_SERVER["DOCUMENT_ROOT"]."/pingbackdata.json", "a");

		fwrite($file, json_encode($orderData));
		fclose($file);

        echo "OK"; exit();
    }
}

echo "NOK";
