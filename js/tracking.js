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
                let ctaTitle = $('.cta');
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
    let betaRef = databaseRef.child('/beta/');
    betaRef.on('value', function(snap){
        let totalUsers = snap.numChildren();
        let fromFb = 0;
        let fromGoogle = 0;
        let fromMail = 0;
        let ulBox = $('.ul-mail');
        ulBox.empty();
        snap.forEach(function(childSnap){
          ulBox.append('<li>'+childSnap.val().mail+'</li>');
          switch (childSnap.val().from){
              case 'Google':
                  fromGoogle++;
                  break;
              case 'Facebook':
                  fromFb++;
                  break;
              case 'Mail':
                  fromMail++;
                  break;
          }
       });
        let statsGoogle = (fromGoogle/totalUsers)*100;
        let statsMail = (fromMail/totalUsers)*100;
        let statsFb = (fromFb/totalUsers)*100;
        let data = {
            labels:['Google','Mail','Facebook'],
            datasets: [
                {
                    backgroundColor: [
                        '#dd4b39',
                        '#708090',
                        '#3B5998'
                    ],
                    borderColor: [
                        '#dd4b39',
                        '#708090',
                        '#3B5998'
                    ],
                    data: [statsGoogle, statsMail, statsFb],
                }
            ]
        }
        let ctx = document.querySelector('.graph-beta') ;
        let myBarChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive:true,
                animation:{
                    animateScale:true
                }
            }
        });
    });

    //Show pagesViews
    let pagesViewRef = databaseRef.child('/pagesView/');
    pagesViewRef.on('value', function (snap) {
        let listPanel = $('#listPanel');
        listPanel.empty();
        let listUsers = snap.numChildren();
        let panel1View = 0;
        let panel2View = 0;
        let panel3View = 0;
        snap.forEach(function (childSnap) {
            panel1View += childSnap.val().panel1;
            panel2View += childSnap.val().panel2;
            panel3View += childSnap.val().panel3;
        });
        listPanel.append('<li> panel 1 : '+Math.round((panel1View/listUsers)*100)+'%</li>');
        listPanel.append('<li> panel 2 : '+Math.round((panel2View/listUsers)*100)+'%</li>');
        listPanel.append('<li> panel 3 : '+Math.round((panel3View/listUsers)*100)+'%</li>');

    })

})(jQuery)