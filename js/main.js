/**
 * Created by POL on 12/02/2017.
 */
(function($){
    // Initialize Firebase
    let config = {
        apiKey: "AIzaSyA-NJEpkQDup6K1HoLiA9-FvkwvE8xCLZc",
        authDomain: "dm-henry.firebaseapp.com",
        databaseURL: "https://dm-henry.firebaseio.com",
        storageBucket: "dm-henry.appspot.com",
        messagingSenderId: "907133393384"
    };
    firebase.initializeApp(config);
    let database = firebase.database();

    //Get current div and check % of site view

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

    //Mousemove
    var slideMove = document.getElementById('slide-1');
    slideMove.addEventListener('mousemove', function(e){
       console.log(e.pageX);
    });

    //CTA - Jouer maintenant
    $('#cta-play').on('click', function(){
       console.log('cta');
    });

    //Ajout d'un visiteur dans la base
    let countVisit = setTimeout(function(){
        //Save in firebase number of visitors
        let visitStats = database.ref("totalVisitors");
        visitStats.once('value').then(function (snapshot) {
            let nVisitors = snapshot.val();
            visitStats.set(nVisitors + 1);
        })
    },5000);
    googleSignout()
    //Google and Facebook firebase Auth
    var provider = new firebase.auth.GoogleAuthProvider();

    $('#google-btn').on('click',function () {
        googleSignin();
    })
    function googleSignin() {
        firebase.auth()
            .signInWithPopup(provider).then(function(result) {
            let token = result.credential.accessToken;
            let user = result.user;
            //Sign with Google add Beta User in firebase
            let uid = result.user.uid
            let mail = result.user.email;
            let from = "Google";
            writeUserBeta(uid, mail, from);


        }).catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;

            console.log(error.code)
            console.log(error.message)
        });
    }
    function googleSignout() {
        firebase.auth().signOut()

            .then(function() {
                console.log('Signout Succesfull')
            }, function(error) {
                console.log('Signout Failed')
            });
    }
    function writeUserBeta(uid,mail,from){
        firebase.database().ref('beta/' + uid).set({
            mail: mail,
            from: from
        });
    }

    //Ajout dans les participants à la bêta
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            console.log(user)
            //Efface les RS et affiche le message de succès
            $('.rs-box').html('Bravo vous êtes inscrits à la bêta !');
            //Ajouter dans firebase l'adresse
        }
        else{
            //if not connected
        }
    });

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


    /***TRACKING***/



})(jQuery)