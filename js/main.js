/**
 * Created by POL on 12/02/2017.
 */
(function($){
    //SmoothScroll
    $('.scroll').on('click', function() { // Au clic sur un élément
        let page;
        if($(this).get(0).nodeName == 'LI'){
            page = $(this).children('a').attr('href'); // Page cible
         }
         else{
            page = $(this).attr('href'); // Page cible
        }
        let speed = 450; // Durée de l'animation (en ms)
        $('html, body').animate( { scrollTop: $(page).offset().top }, speed ); // Go
        return false;
    });


    // Initialize Firebase
    let config = {
        apiKey: "AIzaSyA-NJEpkQDup6K1HoLiA9-FvkwvE8xCLZc",
        authDomain: "dm-henry.firebaseapp.com",
        databaseURL: "https://dm-henry.firebaseio.com",
        storageBucket: "dm-henry.appspot.com",
        messagingSenderId: "907133393384"
    };
    firebase.initializeApp(config);

    //Show input for newsletter
    $('#mail-btn').on('click', function(){
        $('.rs-box').css('transform','translateY(130%)');
        $('.input-box').addClass('isVisible');
    });

    //Cancel input for newsletter
    $('#return').on('click', function(){
        $('.rs-box').css('transform','translateY(0)');
        $('.input-box').removeClass('isVisible');
    });

    //Save mail in firebase
    $('form').on('keypress', function(e){
        if(e.keyCode == 13)
        {
            let mailInput = document.getElementById('newsletter-mail').value;
            if(validateEmail(mailInput)){
                //Save in Firebase and show success
                console.log('send');
            }
            return false;
        }
    })
    $('#send-mail').on('click', function(){
        let mailInput = document.getElementById('newsletter-mail').value;
        if(validateEmail(mailInput)){
            //Save in Firebase and show success
            console.log('send');
        }
    })

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    //Detect where is the user in the landing
    let slide1 = document.getElementById('slide-1');
    document.addEventListener('scroll', function () {
    })

    function isVisible(node) {
        // Am I visible?
        // Height and Width are not explicitly necessary in visibility detection, the bottom, right, top and left are the
        // essential checks. If an image is 0x0, it is technically not visible, so it should not be marked as such.
        // That is why either width or height have to be > 0.
        var rect = node.getBoundingClientRect();
        return (
            (rect.height > 0 || rect.width > 0) &&
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };



})(jQuery)