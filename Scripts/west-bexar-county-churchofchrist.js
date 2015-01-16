$(document).ready
	(function()
		{
			$('#map').gmap3({
					marker:{
						address: '10106 State Highway 151 S San Antonio,TX,USA'
					},
					map:{
						options:{
							zoom: 12
						},
						navigationControl: true,
						scrollwheel: true,
						streetViewControl: true
					}
				}); //end gmap3
			
			//capture the link clicks
			$('body').on('click', '.link', function()
				{
					var targetUrl = $(this).attr('href');
	
					$.get(
						targetUrl,
						function(data) 
						{
							var response = $('<div>' + data + '</div>');
							$('#rightContent').html(response.find('#rightContent').html());
							
							$('#map').gmap3({
								marker:{
									address: '10106 State Highway 151 S San Antonio,TX,USA'
								},
								map:{
									options:{
										zoom: 12
									},
									navigationControl: true,
									scrollwheel: true,
									streetViewControl: true
								}
							}); //end gmap3
						}
					);

					$('.selectedLink').text($('.selectedLink').text().substring(0, $('.selectedLink').text().length - 3));
					$('.selectedLink').addClass('link');
					$('.selectedLink').removeClass('selectedLink');
					
					$(this).text($(this).text() + ' <<');
					$(this).removeClass('link');
					$(this).addClass('selectedLink');					
					
					return false;
				}
			); //end capture of link clicks
			
			//capture the paragraphLink clicks
			$('body').on('click', '.paragraphLink', function()
				{
					var targetUrl = $(this).attr('href');
					var targetID = '#' + targetUrl.substring(0, targetUrl.length - 5);
	
					$.get(
						targetUrl,
						function(data) 
						{
							var response = $('<div>' + data + '</div>');
							$('#rightContent').html(response.find('#rightContent').html());
							
							$('#map').gmap3({
								marker:{
									address: '10106 State Highway 151 S San Antonio,TX,USA'
								},
								map:{
									options:{
										zoom: 12
									},
									navigationControl: true,
									scrollwheel: true,
									streetViewControl: true
								}
							}); //end gmap3
						}
					);

					$('.selectedLink').text($('.selectedLink').text().substring(0, $('.selectedLink').text().length - 3));
					$('.selectedLink').addClass('link');
					$('.selectedLink').removeClass('selectedLink');
					
					$(targetID).text($(targetID).text() + ' <<');
					$(targetID).removeClass('link');
					$(targetID).addClass('selectedLink');					
					
					return false;
				}
			); //end capture of paragraphLink clicks
			
			//capture the submit email click
			$('body').on('click','button.sendEmail',function()
				{
					var sendTo = 'info@wbccc.life';
					var sentFrom = ($('#contactEmail').val().length > 0) ? $.trim($('#contactEmail').val()) : 'noreply@wbccc.life';
					var phone = $.trim($('#contactPhone').val());
					var name = $.trim($('#contactName').val());
					var message = $.trim($('#message').val());
					var hasErrors = false;
					
					if(name.length == 0)
						{
							hasErrors = true;
							$('#contactName').after('<p class = "error">Please enter a name.</p>');
						}
					
					if(sentFrom == "noreply@wbccc.life" && phone.length == 0)
						{
							hasErrors = true;
							$('#contactPhone').after('<p class="error">Please enter either a phone or an email address</p>');
						}
					
					if(message.length == 0)
						{
							hasErrors = true;
							$('#message').after('<p class="error">What would you like to say?</p>');
						}
					
					if(!hasErrors)
						{
							$('.error').hide();
							$.post('./Scripts/email.php'
								, {
									emailTo: sendTo,
									emailFrom: sentFrom,
									contactPhone: phone,
									contactName: name,
									emailMessage: message
								}
								, function(data)
								{
									if(data == "Sent")
									{
										$('#emailForm').hide();
										$('#emailForm').after('<br /> <span>Email sent.  Thank you!</span>');
									}
									else
									{
										$('#emailForm').after('<span class="error">Email failed.  Please try again or call us at 210-901-9932</span>');
									}
								}
							);
						}
					return false;
				}
			); //end capture email click
			
			//capture the get directions click
			$('body').on('click', '#getDirections', function(){
					$('#directionsContainer').remove();
					$('#map').gmap3({
						getroute:	
							{
								options:
									{
										origin: $('#origin').val(),
										destination: '10106 State Highway 151 S, San Antonio, TX, 78251',
										travelMode: google.maps.DirectionsTravelMode.DRIVING
								},
								callback: function(results)
									{
										if(!results) return;
										$(this).gmap3({
											 map:{
											  options:{
													zoom: 12
												},
												navigationControl: true,
												scrollwheel: true,
												streetViewControl: true
											},
											directionsrenderer:{
											  container: ($(document.createElement('div')).addClass('directions').insertAfter($("#mapContainer"))).attr('id', 'directionsContainer'),
											  options:{
												directions:results
											  }
											}
										});// end gmap3
									}
							}
						}
					); //end gmap3
					
					return false;
					
				} // end function
			); // end capture get directions click

		} //end function
	); //end document.ready