/**
 * Created by POL on 16/02/2017.
 */
(function($) {
    // Initialize Firebase
    let config = {
        apiKey: "AIzaSyA-NJEpkQDup6K1HoLiA9-FvkwvE8xCLZc",
        authDomain: "dm-henry.firebaseapp.com",
        databaseURL: "https://dm-henry.firebaseio.com",
        storageBucket: "dm-henry.appspot.com",
        messagingSenderId: "907133393384"
    };
    firebase.initializeApp(config);
    let databaseRef = firebase.database().ref();
    //Show number of visits
    let visitsRef = databaseRef.child('/totalVisitors/');
    visitsRef.on('value', function (snap) {
        let nVisits = document.getElementById('visitsNumber');
        nVisits.innerHTML = snap.val();
    })

    //Show CTA
    let ctaRef = databaseRef.child('/cta/')
    ctaRef.on('value', function (snap) {

        snap.forEach(function(childSnap){
            let childData = childSnap.val();
            let visitsRef = databaseRef.child('/totalVisitors/');
            visitsRef.on('value', function (snapshot) {
                let ctaTitle = $('.content-back');
                let ctaLink = $('#cta-link');

                if(ctaLink.length != 0){
                    ctaLink.remove();
                }
                let nVisits = snapshot.val();
                let efficaciteLien = (Math.round((childData.number/nVisits)*100)/100)*100;
                ctaTitle.append('<p id="cta-link">'+ childSnap.key +': Efficacité du lien => '+efficaciteLien+'%</p>');
            })

        });
    })

    //Show beta-testers


})(jQuery)