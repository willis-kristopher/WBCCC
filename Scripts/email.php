<?php
	$mailTo = $_POST['emailTo'];
	$mailFrom = str_replace("%40", "@", str_replace("%20", " ", urlencode($_POST['emailFrom'])));
	$mailBody = str_replace("%20", " ", urlencode($_POST['contactName']) . "\r\n" . urlencode($_POST['contactPhone']) . "\r\n" . urlencode($_POST['emailMessage']));
	$mailSubject = "Request for Contact";
	$mailHeaders = "From: " . $mailFrom . "\r\n";
	$emailSent = mail($mailTo, "Request for Contact", wordwrap($mailBody, 70), $mailHeaders);
	if($emailSent == TRUE)
	{
		echo "Sent";
	}
	else
	{
		echo "Failed";
	}
	
	;
?>