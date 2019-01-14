<?php

include('fasterpay-php/lib/autoload.php');

$timestamp = $_REQUEST["timestamp"];

$jsonFile = fopen($_SERVER["DOCUMENT_ROOT"]."/data.json", "r");

while(! feof($jsonFile)) {
	$line = json_decode(fgets($jsonFile), true);

	if($line["timestamp"] == $timestamp){
		$paymentData = $line;
		break;
	}
}

$gateway = new FasterPay\Gateway(array(
	'publicKey' 	=> '<your-public-key>',
	'privateKey'	=> '<your-private-key>',
	'apiBaseUrl'	=> "https://pay.fasterpay.com/payment/form"
));

$form = $gateway->paymentForm()->buildForm(
	array(
		'description' => 'Order #'.$timestamp. " Earnests Bar",
		'amount' => $paymentData["cart"]["totalPrice"],
		'currency' => 'USD',
		'merchant_order_id' => $timestamp,
		'success_url' => "https://13d15329.ngrok.io/success.php",
	)
);

echo $form;
