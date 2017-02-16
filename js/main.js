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
    $( "#slide-1" ).hover(function( event ) {
        prevX = event.pageX;
        prevY = event.pageY;
    }, null);

    var slideMove = document.getElementById('slide-1');
    slideMove.addEventListener('mousemove', function(e){

        moveBackground(e);
    });

    function moveBackground( event ) {

        directionMoved( event );

        posX = (movedLeft) ? "-0.5%" : "0.5%";
        posX2 = (movedLeft) ? "-0.3%" : "0.3%";

        $(".chevalier").css({"-webkit-transform":"translateX("+ posX +")"});
        $(".mamuth").css({"-webkit-transform":"translateX("+ posX2 +")"});
        prevX = event.pageX;
        prevY = event.pageY;
    }

    function directionMoved(event)
    {
        movedLeft = (prevX > event.pageX) ? true : false;
        movedUp = (prevY > event.pageY) ? true : false;
    }

    //CTA - Jouer maintenant
    $('#cta-play').on('click', function(){
       let link = $(this).attr('id');
       writeCTA(link)
    });

    function writeCTA(link){
        let uid = link
        let count = database.ref("cta/"+link);
        count.once('value').then(function (snapshot) {
            let nCount = snapshot.val();
            if(nCount != null){
                firebase.database().ref('cta/' + uid).set({
                    number:nCount.number+1
                });
            }
            else{
                firebase.database().ref('cta/' + uid).set({
                    number:1
                });
            }
        })

    }



    //Ajout d'un visiteur dans la base
    let countVisit = setTimeout(function(){
        //Save in firebase number of visitors
        let visitStats = database.ref("totalVisitors");
        visitStats.once('value').then(function (snapshot) {
            let nVisitors = snapshot.val();
            visitStats.set(nVisitors + 1);
        })
    },5000);


    //On parle de nous
    let testimonialsRef = database.ref("testimonials");
    testimonialsRef.on('value', function (snapshot) {
        let testiDiv = $('.testi');
        testiDiv.empty();
        snapshot.forEach(function(childSnap){
            console.log(testiDiv);
            let html = '<div class="testi-user"> <h4 class="testi-name">'+childSnap.key+'</h4>';
            html +=  '<img class="testi-img" src="'+childSnap.val().imgUrl+'">'
            html +=  '<p class="testi-text">'+childSnap.val().text+'</p></div>';
            testiDiv.append(html);
            
        });
    });

    googleSignout()
    //Google and Facebook firebase Auth
    var provider = new firebase.auth.GoogleAuthProvider();

    //Facebook
    var providerFb = new firebase.auth.FacebookAuthProvider();
    $('#fb-btn').on('click',function () {
        fbSignin();
    })
    function fbSignin(){
        firebase.auth().signInWithPopup(providerFb).then(function(result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(user);
            let uid = result.user.uid
            let mail = result.user.email;
            let from = "Facebook";
            writeUserBeta(uid, mail, from);
            // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }


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
                let uid = hashCode(mailInput)
                let from = "Mail";
                writeUserBeta(uid, mailInput, from);
                $('.rs-box').html('Bravo vous êtes inscrits à la bêta !');
            }
            return false;
        }
    })
    $('#send-mail').on('click', function(){
        let mailInput = document.getElementById('newsletter-mail').value;
        if(validateEmail(mailInput)){
            //Save in Firebase and show success
            let uid = hashCode(mailInput)
            let from = "Mail";
            writeUserBeta(uid, mailInput, from);
            $('.rs-box').html('Bravo vous êtes inscrits à la bêta !');
            console.log('send');
        }
    })
    hashCode = function(str){
        var hash = 0;
        if (str.length == 0) return hash;
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    //Detect where is the user in the landing
    var randomString = function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    let rNumber = Math.round(Math.random()*2048);
    let userToken = randomString(22)+rNumber;
    console.log(userToken);
    let slide1 = document.getElementById('slide-1');
    let slide2 = document.getElementById('slide-2');
    let slide3 = document.getElementById('slide-3');


    isVisible(slide1);
    //Get pagesViewRef
    //let pagesViewRef = database.child('/pagesView/');
    if(isVisible(slide1)){
        setTimeout(function () {
            //If user see the page during 5s add to Firebase
            console.log('ok');
        },5000)
    }


    function writePagesView(uid, pourcentage){
        firebase.database().ref('pagesView/' + uid).set({
            pourcentage:pourcentage
        });
    }

    console.log(isVisible(slide1))
    document.addEventListener('scroll', function () {
        console.log(isVisible(slide2));
        console.log(isVisible(slide3));

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
            rect.top <= (window.innerHeight-200 || document.documentElement.clientHeight-200) &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };


    /***TRACKING***/



})(jQuery)