
//base URL for our post request
var base_url = 'http://localhost:3000/';

var startBttn;


$(document).ready(function() {

  startBttn = $('#startBttn');

  // get access to camera and stream video
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream); //get video stream
          video.play(); //stream it
      });
  }

  $(startBttn).click(function() {
      console.log("startBttn was clicked");
      setTimeout(makeGIF, 1000);
  });

});



function makeGIF() {

  gifshot.createGIF({

    gifWidth: 600,
    gifHeight: 450,
    interval: .75,
    sampleInterval: 1, //dictates the quality
    // text: '#ITP-WEEN',
    // fontSize: '46px',
    // fontFamily: 'Creepster',
    // textAlign: 'left',
    // textXCoordinate: 10,
    // textYCoordinate: 395,
    
    progressCallback: function(captureProgress) {

        //hide the button as soon as the process starts
        $("#startBttn").hide(); 

        //show the progress as a counter
        console.log(captureProgress);  
        captureProgress = captureProgress * 10; //get whole numbers
        $("#counter").show();
        $("#counter").html(captureProgress);
    }
    // saveRenderingContexts: true

  }, function (obj) { // callback for the gif

      if (!obj.error) { //if there's no error
        var image = obj.image, animatedImage = document.createElement('img');
        animatedImage.src = image;
        animatedImage.className = "myGIF";
        console.log("The gif is done");

        //when the gif is done, hide the video capture and counter
        $("#counter").hide();
        $("#video").hide(); 
        

        //append to the video container to replace the video
        $("#vidContainer").append(animatedImage);
        gifUrl = animatedImage.src;
        // console.log("image source is: " + animatedImage.src);

        //send the GIF to be saved
        sendData();

        //then reset
        setTimeout(resetToRecord, 10000);
      }
   });
}



function sendData(){

 // SEND DATA TO SERVER
 // when the gif is done, send the data of the image source to the server via ajax request
    var data = {
        "gif": gifUrl 
    }

    //make a post request so we can grab inputs to send to twilio
    $.ajax({
        "url": base_url + "savegif",
        "method": "POST",
        "data": data
    })

    .done(function(msg){
        console.log("ajax request done")
    });
}


function resetToRecord() {

  //show the video and the button
  $("#video").show(); 
  $("#startBttn").show(); 


  // //hide the GIF - timing is weird
  // $(".myGIF").attr('style','display:none');
  $(".myGIF").hide();


  //change it back to pre-record state (state 0)
  console.log("back to starting state!");
}
