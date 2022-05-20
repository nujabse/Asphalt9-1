"auto";
const robot = require('./robot.js');
const profile = require('./profile.js');

var startTime = new Date().getTime();
var timer = new Date().getTime();

var lastLevel = 0;
var lastCar   = 0;
var routeRegion = [850, 150, 650, 160];
var adPkgSetRegion = [0, 300, 2340, 200];
var adSeeSetRegion = [924, 887, 500, 160];

module.exports = {
    base : {
        click(x,y) {
            robot.click(x,y);
        },
        swipe(x1, y1, x2, y2, d){
            robot.swipe(x1, y1, x2, y2, d);
        }, 
        back() {
            robot.back();
        },
        pressNitro() {
            PressNitro();
        },
        restart()
        {
            Restart("Asphalt 9");
        },
        restartWithReset()
        {
            RestartWithReset("Asphalt 9");
        },
        AdCloser()
        {
            return ImageClicker(profile.adCloserFolder);
        },
        AdCloser2()
        {
            return ImageClicker('./Images/AdCloser2/');
        },
        AdInfinte(packageName)
        {
            c = 0;
            sleep(500);
            var res = mpCheckState();
            log('state = ' + res);
            while(res == "unknow") {
                //robot.swipe(2000, 400, 888, 400, 400);
                sleep(1000); 
                //if (!ImageClicker('./AdInfinite-B/'))
                ImageClicker('./Images/AdInfinite-B/')
                sleep(1000); 
                robot.back();
                sleep(5000); 
                res = mpCheckState();   
                log('state = ' + res);
            }

            var pos = null;
            //go to the store
            if (res == "index" || res == "home")
            {
                robot.click(1200,50); //store
                sleep(6000); 

                var pos = FindImage('./Images/AdInfinite-1/', 'Free.png', adPkgSetRegion);
                if (pos == null)
                {
                    robot.click(1200,50); //store to begin
                    sleep(3000); 
                }
                log('store');
            }

            //find > free button
            var pos = FindImage('./Images/AdInfinite-1/', 'Free.png', adPkgSetRegion);
            while(pos == null && c < 8) {
                robot.swipe(1500, 400, 500, 400, 400);
                sleep(1000); 
                c++;
                pos = FindImage('./Images/AdInfinite-1/', 'Free.png', adPkgSetRegion);
            }

            //go free ad
            if (pos)
               robot.click(pos.x, pos.y); 
            else
                return "error";
            log('free ad');
            sleep(6000);

            
            //let see advert
            c = 0;
            pos = FindImage('./Images/AdInfinite-1/', 'See-ad.png', adSeeSetRegion);
            while(pos == null && c < 200) {
                c++;
                sleep(100); 
                pos = FindImage('./Images/AdInfinite-1/', 'See-ad.png', adSeeSetRegion);
            }
            if (pos)
               robot.click(pos.x, pos.y); 
            else   
            {
                var img = captureScreen();
                var isGreenBtn = isSimilar(img, {x: 950, y: 920, color: "#c3fb12"}, 5);
                if (isGreenBtn)
                    robot.click(950, 920);
                else
                    return "noads";
            }    
            log('see ad');
            //faster way
            var adStartTime =  new Date().getTime();
            var nowTime = new Date().getTime();
            sleep(10000);
            c = 0;
            while(c < 45 && (nowTime - adStartTime) < 60000) {
                nowTime = new Date().getTime();
                sleep(1000); 
                c = c + 1;

                if ((nowTime - adStartTime)%10000 == 0)
                    toastLog(c + " seconds");

                if (ImageFinder('./Images/AdCloser/'))
                    c = 45;
            }   
            //sleep(60000);
            log('60 sec gone');
            
            CloseApp();
            CloseApp();
            CloseApp();
            sleep(5000);

            toastLog("restart " + packageName);
            //launchApp("Asphalt 9");
            launch(packageName);
            sleep(25000);
            
            // Close popups
            c = 0;
            sleep(500);
            var res = mpCheckState();
            while(res == "unknow" || res == "next") {
                //robot.swipe(2000, 400, 500, 400, 400);
                sleep(1000);
                c = c + 1;

                if ((nowTime - adStartTime)%10000 == 0)
                    toastLog(c + " seconds");

                if (!ImageClicker('./Images/AdCloser2/'))
                    robot.back();
                sleep(5000); 
                res = mpCheckState();   
            }        
            /*
            c = 0;
            var ic = 0;
            res = mpCheckState();
            log('state = ' + res);
            while(res != "home" && res != "index" ) {
                //c++;
                if (ImageClicker('./Images/AdCloser/'))
                {
                    sleep(10000);
                    ic++;
                    if (ic > 3)
                        robot.back();
                    if (ic > 10)
                        ImageClicker('./Images/AdInfinite-S/')       
                    if (ic > 12)
                        return "error";
                }
                else
                {
                    robot.back();
                }
                sleep(5000); 
                res = mpCheckState();
                log('state = ' + res);
            }
            if (res == "unknow")
                return "error";

            
            c = 0;
            pos = FindImage('./AdInfinite-1/', 'See-ad.png');
            while(pos == null && c < 3) {
                c++;
                if (!ImageClicker('./AdCloser/'))
                    robot.back();
                log('try back ' + c);
                sleep(5000); 
                pos = FindImage('./AdInfinite-1/', 'See-ad.png');
            }
            if (pos == null)
                return "noads";*/
            return "ok";
        },
        TicketInfinte(cnt)
        {
            for ( let i = 0; i < cnt; i++ ) {
                toastLog("grind ticket " + (i + 1));
                // CHECK START SCREEN
                var img = captureScreen();
        
                var isToken = isEquals(img, profile.common.token);
                var isCredit = isEquals(img, profile.common.credit);
                var isBack = isSimilar(img, profile.common.back, 5) && isSimilar(img, profile.common.backward, 5);
                var isEventPage = isMarker(img, profile.eventPage, profile.common.pagesMarker);
                
                if (isToken && isCredit && !isBack && !isEventPage)
                {
                    pressMarkerButton(profile.eventPage, profile.common.pagesMarker)            
                }
                // ENTER EVENTS
                pressMarkerButton(profile.eventPage, profile.common.pagesMarker)     
                sleep(2000);
                
                // TICKETS
                robot.click(2012, 201);
                sleep(12000);
                
                // CHECK AD BUTTON
                img = captureScreen();
                if (!isButtonEdge(img, {x: 1600, y: 675, color: "#ff0054"}, false))
                {
                    return "full";
                } 
                if (isButtonEdge(img, {x: 1600, y: 726, color: "#ffffff"}, false))
                {
                    // WATCH AD
                    robot.click(1600, 726);
                    sleep(45000);
                    
                    robot.swipe(2300, 600, 800, 610, 300);
                    sleep(1000);
                    robot. click(2270, 780);
                    sleep(1000);
                    robot.swipe(1200, 600, 100, 611, 200);
                    sleep(1000);
                   
                    // LAUNCH A9
                    launchApp("Asphalt 9");
                    sleep(25000);
                    
                    // Close popups
                    c = 0;
                    sleep(500);
                    var res = mpCheckState();
                    while(res == "unknow") {
                        robot.swipe(2000, 400, 500, 400, 400);
                        sleep(1000); 
                        if (!ImageClicker('./Images/AdCloser2/'))
                            robot.back();
                        sleep(5000); 
                        res = mpCheckState();   
                    }
                }
            }
            return "done";
        },
        adjustSwipeFlat(carNumber, swipeLimit){
            var firstCar = profile.garage.firstCarFlat;
            var distance = profile.garage.distanceFlat;

            var carPoint = locateCar(carNumber, swipeLimit, firstCar, distance);
            var _img = captureScreen();
            var img = images.copy(_img);
            toastLog(PrintPixel(img, carPoint));
        },
        adjustSwipe(carNumber, swipeLimit){
            var firstCar = profile.garage.firstCar;
            var distance = profile.garage.distance;

            var carPoint = locateCar(carNumber, swipeLimit, firstCar, distance);
            var _img = captureScreen();
            var img = images.copy(_img);
            toastLog(PrintPixel(img, carPoint));
        },
        swipeEventsAtEnd()
        {
            //eventsMarker: { x: 263, y: 1055, color: '#c3fb12', delta: 281, pressXOffset: 0, pressYOffset: -200 },
            var mrkY = profile.common.eventsMarker.y + profile.common.eventsMarker.pressYOffset;
            toastLog(mrkY); 
            for(let j = 0; j < 5; j++) {
                robot.swipe(2000, mrkY, 500, mrkY, 400);
                sleep(500);
            } 
        },
        testParseNavigation()
        {
            log(parseNavigation(profile.ch.navigation));
        }
    },
    //==========================================================================
    // Multiplayer
    mp: {
        goingHome(){
            log("goingHome");
            var Flag = false;
            var stacked = 0;
            var mpStatus = "";
            while (!Flag){
            
                mpStatus = mpCheckState();
                if (mpStatus != -1) 
                    timer = new Date().getTime();
                
                switch(mpStatus){
                    case "home": {
                        Flag = true;
                        break;
                    }
                    
                    case "index": {
                        Flag = true;
                        break;
                    }
                    
                    case "start": {
                        robot.back();
                        sleep(2000);
                        break;
                    }
                    
                    case "race": {
                        sleep(5000);
                        break;
                    }
                    
                    case "next": {
                        sleep(2000);
                        robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                        break;
                    } 
                    
                    case "dialog": {
	              	    robot.back();
	                    sleep(2000);                           
                 		break;            
                    }   
                    
                    case "unknow": {
                        var now = new Date().getTime();
                        if ((now - timer) > 30000) {
                            Screenshot("blocked");
                            toastLog("(mp-gh)blocked!restart!" + mpCheckState(true));
                            timer = new Date().getTime();
                            if (!ImageClicker(profile.adCloserFolder))
                                robot.back();
                            sleep(2000);
                            stacked++;
                            if (stacked > 2)
                            {
                                stacked = 0;
                                Restart("Asphalt 9");
                            }
                        }
                    }        
                }
            }
        },   
        //----------------------------------------------------------------------
        beforeRun(option) {
            log("beforeRun");
            var tries = 0;
            var last = "";
            var Flag = false;
            var mpStatus = "";
            var stacked = 0;
            while (!Flag){

                mpStatus = mpCheckState();
                if (mpStatus != "unknow")
                    timer = new Date().getTime();

                // count sequence of mpStatus
                if (last == mpStatus) {
                     tries++;
                } else {
                     tries = 1;
                     last = mpStatus;
                }
                
                if (tries > 250) {
                    toastLog("go back by tries overflow for " + mpStatus);
                    robot.back();
	                sleep(2000);
                    tries = 1;
                }
                
                switch(mpStatus){
                    case "home": {
                        if (tries > 2 && last == "home") {
                            if (option.game == 2) {
                                robot.click(profile.mp.game2of2.x, profile.mp.game2of2.y);
                            } 
                            if (option.game == 1) {
                                robot.click(profile.mp.game1of2.x, profile.mp.game1of2.y);
                            }
                            sleep(2000);
                        }
                        break;
                    }
                    
                    case "index": {
                        if (tries > 2 && last == "index") {
                            pressMarkerButton(profile.networkPage, profile.common.pagesMarker);
                            sleep(2000);
                        }
                        break;
                    }
                    
                    case "start": {
                        if (tries > 15 && last == "start") {
                            sleep(2000);
                            Flag = true;
                        }
                        break;
                    }
                    
                    case "race": {
                        sleep(2000);
                        break;
                    }
                    
                    case "next": {
                        if (tries > 2 && last == "next") {
                            sleep(2000);
                            robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                        }
                        break;
                    }
                    
                    case "dialog": {
                        if (tries > 2 && last == "dialog") {
                            robot.back();
	                        sleep(2000);
                        }                           
                 		break;            
                    } 
                    
                    case "unknow": {
                        var now = new Date().getTime();
                        if ((now - timer) > 10000) {
                            Screenshot("blocked");
                            toastLog("(mp-br)blocked!restart!" + mpCheckState(true));
                            timer = new Date().getTime();
                            if (!ImageClicker(profile.adCloserFolder))
                                robot.back();
                            sleep(2000);
                            stacked++;
                            if (stacked > 2)
                            {
                                stacked = 0;
                                Restart("Asphalt 9");
                            }
                        }
                    }
                }
                sleep(500);
             }
        },    
        //----------------------------------------------------------------------
        chooseCar(option) {
            log("chooseCar");
            if (1)
        	{
                lastLevel = getCurrentLeagueLevel();
	       	}
            robot.click(profile.mp.start.x, profile.mp.start.y);
            sleep(4000);
            
            if (option.carPickMode == "none")
            {
                // Check if car available fuel
                if (IsFlashingButton(profile.garage.start, 7) || IsFlashingButton(profile.garage.istart, 7))
                {
                    log("chooseCar>> READY");
                    robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                    return true;
                }
                return false;
            }
            
            if (option.carPickMode == "ordinary")
            {     
                var FOUND = false;
       
                for (let i = lastLevel; i < 5 && !FOUND; i++){
                    if (option.status[i]){
                        if (hasFuel(option.levelName[i], option.carPick, option.carPickSwipeLimit)){
                            FOUND = true;
                            lastLevel = i;
                        }
                    }
                }
                log("chooseCar>> FOUND = " + FOUND);            
                if (FOUND){
                    // Find a car with gas
                    sleep(4000);
                    
                    // Check if car available fuel
                    if (IsFlashingButton(profile.garage.start, 7) || IsFlashingButton(profile.garage.istart, 7))
                    {
                        log("chooseCar>> READY");
                        robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                        return true;
                    }
                }
                lastLevel = 0;  
                lastCar   = 0;    
                toastLog("No fuel.");
                return false;
            }
            
            if (option.carPickMode == "ordinary-abc")
            {
                var FOUND = false;

                for (let i = lastLevel; i < 5 && !FOUND; i++){
                    if (option.status[i]){
                        if (hasFuelABC(option.levelName[i], option.carPick)){
                            FOUND = true;
                        }
                    }
                }

                log("chooseCar>> FOUND = " + FOUND);            
                if (FOUND){
                    // Find a car with gas
                    sleep(4000);
                    
                    // Check if car available fuel
                    if (IsFlashingButton(profile.garage.start, 7) || IsFlashingButton(profile.garage.istart, 7))
                    {
                        log("chooseCar>> READY");
                        robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                        return true;
                    }
                }
                toastLog("No fuel.");
                return false;   
            }

            return false;
        },
        //----------------------------------------------------------------------
        run(cnt, option) {
            log("run"); 
            var left = 0;
            var runTime = new Date().getTime();
            var tries = 0;
            var routeTime =  new Date().getTime();
            var nitroTime =  new Date().getTime();

            var nitroTick = 200;
            if (option.nitroTick != null)
                nitroTick = option.nitroTick;

            // Check if you have reached the checkout interface
            while (true) {
                var nowTime = new Date().getTime();
                if ((nowTime - runTime) > 250000) {
                    Screenshot("blocked");
                    toastLog("(mp-run)blocked!restart!" + mpCheckState(true));
                    if (!ImageClicker(profile.adCloserFolder))
                        robot.back();
	                sleep(2000);
                    break;
                }
                
                var mpStatus = mpCheckState();
                // exit conditions
                if (!(mpStatus == "unknow" || mpStatus == "race")) {
                    // waiting 3 times of no race condition
                    tries++;
                    if (tries > 2)
                    {
                        toastLog("mp-run exit with state = " + mpStatus);
                        break;
                    }
                }
                // If you have not finished running, you can still click on nitrogen
                else {
                    // reset accidental exit 
                    tries = 0;

                    if ((nowTime - nitroTime) > nitroTick)
                    {   
                        nitroTime = new Date().getTime();
                        PressNitro();
                    }
                    if (profile.mpSignSet && (nowTime - routeTime) > 3000)
                    {
                        var t = SignClicker(profile.mpSignSet, routeRegion);
                        if (t)
                            routeTime =  new Date().getTime();
                    }
                }
                sleep(950);
            }
            toastLog(++cnt.MP + " multiplayer done, t.avg " +parseInt((nowTime - startTime)/1000/cnt.MP)+" second.");
        },
        //----------------------------------------------------------------------
        test(option) {
            //var img = captureScreen();
            //toastLog(PrintPixel(img, profile.mp.game1of2));
            //toastLog(PrintPixel(img, profile.mp.game2of2));
            toastLog("mpCheckState " + mpCheckState(true));
        }
    },
    // CarHunt
    ch:{
        goingHome(){
            var tries = 0;
            var Flag = false;
            timer = new Date().getTime();
            while (!Flag){

                var chStatus = chCheckState();
                if (chStatus != "unknow")
                    timer = new Date().getTime();
                
                switch(chStatus){
                    case "home": {
                        Flag = true;
                        break;
                    }
                    
                    case "index": {
                        Flag = true;
                        break;
                    }
                    
                    case "start":
                    case "events":
                    case "hunt":
                    case "dialog": {
                        robot.back();
                        sleep(2000);
                        break;
                    }
                    
                    case "race": {
                        sleep(5000);
                        break;
                    }
                    
                    case "next": {
                        sleep(2000);
                        robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                        break;
                    } 
                    
                    case "unknow": {
                        var now = new Date().getTime();
                        if ((now - timer) > 15000) {
                            tries++;
                            Screenshot("ch-blocked");
                            toastLog("(ch-gh)blocked!restart!" + chCheckState(true));
                            timer = new Date().getTime();
                            // exclusive
                            if (tries > 3)
                            {
                                if (!ImageClicker(profile.adCloserFolder))
                                    robot.back();
    	                        sleep(2000);
                            }
                            
                        }                    
                    }
                }
                sleep(1000);
            }
        }, 
        //----------------------------------------------------------------------
        beforeRun() {
            var tries = 0;
            var last = "";
            var Flag = false;
            var chStatus = ""; 
            while (!Flag){
                
                chStatus = chCheckState();
                if (chStatus != "unknow")
                    timer = new Date().getTime();

                // count sequence of chStatus
                if (last == chStatus) {
                     tries++;
                } else {
                     tries = 1;
                     last = chStatus;
                }
                
                if (tries > 250) {
                    toastLog("go back by tries overflow for " + chStatus);
                    robot.back();
	                sleep(2000);
                    tries = 1;
                }
                
                switch(chStatus){
                    case "home": {
                        if (tries > 2 && last == "home") {
                            pressMarkerButton(profile.eventPage, profile.common.pagesMarker);
                            sleep(2000);
                        }
                        break;
                    }
                    
                    case "index": {
                        if (tries > 2 && last == "index") {
                            pressMarkerButton(profile.eventPage, profile.common.pagesMarker);
                            sleep(2000);
                        }
                        break;
                    }
                    
                    case "events": {
                        if (tries > 2 && last == "events") {
                            pressMarkerButton(profile.carHuntPosition, profile.common.eventsMarker);
                            sleep(2000);
                        }
                        break;
                    }
                    
                    //case "hunt": {
                    //    if (tries > 2 && last == "hunt") {
                    //        pressMarkerButton(profile.carHuntPosition, profile.common.eventsMarker);
                    //        sleep(2000);
                    //    }
                    //    break;
                    //}
                    
                    case "start": {
                        if (tries > 2 && last == "start") {
                            sleep(2000);
                            Flag = true;
                        }
                        break;
                    }
                    
                    case "race": {
                        sleep(2000);
                        break;
                    }
                    
                    case "next": {
                        if (tries > 2 && last == "next") {
                            sleep(2000);
                            robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                        }
                        break;
                    }
                    
                    case "dialog": {
                        if (tries > 2 && last == "dialog") {
                            robot.back();
	                        sleep(2000);
                        }                           
                 		break;            
                    } 
                    
                    case "unknow": {
                        var now = new Date().getTime();
                        if ((now - timer) > 300000) {
                            Screenshot("ch-blocked");
                            toastLog("(ch-br)blocked!restart!" + chCheckState(true));
                            timer = new Date().getTime();
                            if (!ImageClicker(profile.adCloserFolder))
                                robot.back();
    	                    sleep(2000);
                        }
                    }
                }
                sleep(500);
             }
        }, 
        chooseCar() {
            robot.click(profile.ch.start.x, profile.ch.start.y);
            sleep(4000);
            
            if (profile.ch.carPickMode == "up" || profile.ch.carPickMode == "down")
            {
                if (profile.ch.carPickMode == "up")
                    robot.click(profile.width/2, profile.garage.firstCar.y);
                else
                    robot.click(profile.width/2, profile.garage.firstCar.y + profile.garage.distance.y);
                sleep(2000);
                
                if (IsFlashingButton(profile.garage.start, 7) || IsFlashingButton(profile.garage.istart, 7))
                {
                    robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                    return true;
                }
    
                toastLog("\nNo fuel.");
                base.back();
                sleep(1500);
                base.back();
                sleep(1500);
            }
            
            if (profile.ch.carPickMode == "flat")
            {     
                var FOUND = hasFuelFlat(profile.ch.carPick, profile.ch.carPickSwipeLimit);
                //log("chooseCar>> FOUND = " + FOUND);            
                if (FOUND){
                    // Find a car with gas
                    sleep(4000);
                    
                    // Check if car available fuel
                    if (IsFlashingButton(profile.garage.start, 7) || IsFlashingButton(profile.garage.istart, 7))
                    {
                        //log("chooseCar>> READY");
                        robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                        return true;
                    }
                }
                lastCar   = 0;    
                toastLog("No fuel.");
            }
            
            if (profile.ch.carPickMode == "flat-abc")
            {
                var FOUND = hasFuelFlatABC(profile.ch.carPick);

                log("chooseCar>> FOUND = " + FOUND);            
                if (FOUND){
                    // Find a car with gas
                    sleep(4000);
                    
                    // Check if car available fuel
                    if (IsFlashingButton(profile.garage.start, 7) || IsFlashingButton(profile.garage.istart, 7))
                    {
                        log("chooseCar>> READY");
                        robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                        return true;
                    }
                }
                toastLog("No fuel.");
                return false;   
            }
            return false;
        },  
        //----------------------------------------------------------------------
        run(cnt, option) {
                        
            var runTime = new Date().getTime();
            var tries = 0;
            var brkc = 4;
            var chStatus = "";
            var routeTime =  new Date().getTime();
            var nitroTime =  new Date().getTime();
            var raceStart = false;
            var raceTime =  null;

            //check nav data
            var route = null;
            if (profile.ch.navigation != null)
                route = parseNavigation(profile.ch.navigation);
            
            var nitroTick = 200;
            if (option.nitroTick != null)
                nitroTick = option.nitroTick;

            var currentRoute = profile.huntSignSet;

            // Check if you have reached the checkout interface
            while (true) {
                var nowTime = new Date().getTime();
                if ((nowTime - runTime) > 240000) {
                    Screenshot("ch-blocked");
                    toastLog("(ch-run)blocked!restart!" + chCheckState(true));
                    robot.back();
	                sleep(2000);
                    robot.back();
	                sleep(2000);
                    robot.back();
	                sleep(2000);
                    break;
                }
                
                chStatus = chCheckState();
                // exit conditions
                if (!(chStatus == "unknow" || chStatus == "race")) {
                    // waiting 3 times of no race condition
                    tries++;
                    if (tries > 2)
                    {
                        toastLog("mp-run exit with state = " + chStatus);
                        if (chStatus == "dialog")
                        {
                            robot.back();
	                        sleep(2000);
                            robot.back();
	                        sleep(2000);
                            robot.back();
	                        sleep(2000);
                        }
                        break;
                    }
                }
                // If you have not finished running, you can still click on nitrogen
                else {
                    if (!raceStart && chStatus == "race")
                    {
                        raceStart = true;
                        raceTime =  new Date().getTime();
                    }
                    // reset accidental exit 
                    tries = 0;
                    /*brkc--;
                    if (brkc < 0)
                    {
                        brkc = 2;
                        PressBrake();
                    }*/
                    if (raceStart && route != null)
                    {
                        for (let i = 0; i < route.length; i++) {
                            let item = route[i];
                            if (!item.fire && (nowTime-raceTime) > item.time)
                            {
                                item.fire = true;

                                if (item.type == "drift")
                                    PressBrake(item.dur);

                                if (item.type == "drift-flash")
                                {
                                    PressBrake(item.dur);
                                    sleep(50);
                                    PressNitro();
                                    PressNitro();
                                }

                                if (item.type == "normal-nitro")
                                {
                                    PressNitro();
                                }

                                if (item.type == "perfect-nitro")
                                {
                                    PressNitro();
                                    sleep(750);
                                    PressNitro();
                                }

                                if (item.type == "double-nitro")
                                {
                                    PressNitro();
                                    sleep(300);
                                    PressNitro();
                                }

                                if (item.type == "flash")
                                {
                                    PressNitro();
                                    PressNitro();
                                }

                                if (item.type == "360")
                                {
                                    PressBrake();
                                    PressBrake();
                                }

                                if (item.type == "360-flash")
                                {
                                    PressBrake();
                                    PressBrake();
                                    sleep(50);
                                    PressNitro();
                                    PressNitro();
                                }

                                if (item.type == "route")
                                    currentRoute = item.path
                            }
                        }
                    }

                    if ((nowTime - nitroTime) > nitroTick)
                    {   
                        nitroTime = new Date().getTime();
                        PressNitro();
                    }
                    if (currentRoute && (nowTime - routeTime) > 2000)
                    {
                        var t = SignClicker(currentRoute, routeRegion);
                        if (t)
                        {
                            routeTime =  new Date().getTime();
                        }
                    }    
                }
                sleep(100);
            }
            toastLog(++cnt.CH + " car hunt done, t.avg" +parseInt((nowTime - startTime)/1000/cnt.CH)+" second.");
        },
        //----------------------------------------------------------------------   
        test(option) {
            //toastLog("chCheckState " + chCheckState());
            var img = captureScreen();
            toastLog(PrintPixel(img, {x: 2130, y: 81, color: "#39393b"}));
        },
        
        ad(){
            sleep(3000);
            //var img = captureScreen();
            //A tickects check
            //toastLog(PrintPixel(img, {x: 2020, y: 200, color: "#ffffff"}));
            //if (isEquals(img, {x: 2020, y: 200, color: "#ffffff"}))
            //{
                robot.click(2012, 201);
                sleep(10000);
                var _img = captureScreen();
                var img = images.copy(_img);
                if (!isButtonEdge(img, {x: 1600, y: 675, color: "#ff0054"}, false))
                {
                    //robot.back();
                    //sleep(1500);
                    return "full";
                } 
                if (isButtonEdge(img, {x: 1600, y: 726, color: "#ffffff"}, false))
                {
                    robot.click(1600, 726);
                    sleep(60000);
                    //robot.back();
                    //sleep(1500);
                    //if (chCheckState() != "hunt")
                    //{
                    //    robot.back();
                    //    sleep(1500);
                    //}
                    //if (chCheckState() != "hunt")
                    //{
                    //    robot.back();
                    //    sleep(1500);
                    //}
                    return "aded";
                }
                //robot.back();
                //sleep(1500);
                return "noad";
            //}
            //return "error";
        },
        state()
        {   
            return chCheckState();
        }
    },
    // CarHunt
    chse:{
        goingHome(){
            var tries = 0;
            var Flag = false;
            timer = new Date().getTime();
            while (!Flag){

                var chStatus = chseCheckState();
                if (chStatus != "unknow")
                    timer = new Date().getTime();
                
                switch(chStatus){

                    case "home": 
                    case "index":
                    case "events":{
                        Flag = true;
                        break;
                    }
                    
                    case "start":
                    case "hunt":
                    case "dialog": {
                        robot.back();
                        sleep(2000);
                        break;
                    }
                    
                    case "race": {
                        sleep(5000);
                        break;
                    }
                    
                    case "next": {
                        sleep(2000);
                        robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                        break;
                    } 
                    
                    case "unknow": {
                        var now = new Date().getTime();
                        if ((now - timer) > 15000) {
                            tries++;
                            Screenshot("ch-blocked");
                            toastLog("(ch-gh)blocked!restart!" + chseCheckState(true));
                            timer = new Date().getTime();
                            // exclusive
                            if (tries > 3)
                            {
                                if (!ImageClicker(profile.adCloserFolder))
                                    robot.back();
                                sleep(2000);
                            }
                            
                        }                    
                    }
                }
                sleep(1000);
            }
        }, 
        //----------------------------------------------------------------------
        beforeRun() {
            var tries = 0;
            var last = "";
            var Flag = false;
            var chStatus = ""; 
            while (!Flag){
                
                chStatus = chseCheckState();
                if (chStatus != "unknow")
                    timer = new Date().getTime();

                // count sequence of chStatus
                if (last == chStatus) {
                     tries++;
                } else {
                     tries = 1;
                     last = chStatus;
                }
                
                if (tries > 250) {
                    toastLog("go back by tries overflow for " + chStatus);
                    robot.back();
                    sleep(2000);
                    tries = 1;
                }
                
                switch(chStatus){
                    case "home": {
                        if (tries > 2 && last == "home") {
                            //robot.click(profile.ch.specialSelector.x, profile.ch.specialSelector.y);
                            var pos = FindImage('./Images/Interface/', 'hunt-small.png');
                            if (pos)
                               robot.click(pos.x, pos.y);
                            else   
                                robot.swipe(300, 500, 300, 250, 800);
                            sleep(2000);
                        }
                        break;
                    }
                    
                    case "index": {
                        if (tries > 2 && last == "index") {
                            pressMarkerButton(profile.specialPage, profile.common.pagesMarker);
                            sleep(2000);
                        }
                        break;
                    }
                    
                    case "events": {
                        if (tries > 2 && last == "events") {
                            robot.click(profile.ch.specialStart.x, profile.ch.specialStart.y);
                            sleep(2000);
                        }
                        break;
                    }
                    
                    case "hunt": {
                        if (tries > 2 && last == "hunt") {
                            robot.click(profile.ch.specialHunt.x, profile.ch.specialHunt.y);
                            sleep(2000);
                        }
                        break;
                    }
                    
                    case "start": {
                        if (tries > 2 && last == "start") {
                            sleep(2000);
                            Flag = true;
                        }
                        break;
                    }
                    
                    case "race": {
                        sleep(2000);
                        break;
                    }
                    
                    case "next": {
                        if (tries > 2 && last == "next") {
                            sleep(2000);
                            robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                        }
                        break;
                    }
                    
                    case "dialog": {
                        if (tries > 2 && last == "dialog") {
                            robot.back();
                            sleep(2000);
                        }                           
                        break;            
                    } 
                    
                    case "unknow": {
                        var now = new Date().getTime();
                        if ((now - timer) > 300000) {
                            Screenshot("ch-blocked");
                            toastLog("(ch-br)blocked!restart!" + chseCheckState(true));
                            timer = new Date().getTime();
                            if (!ImageClicker(profile.adCloserFolder))
                                robot.back();
                            sleep(2000);
                        }
                    }
                }
                sleep(500);
             }
        }, 
        chooseCar() {
            robot.click(profile.ch.specialNext.x, profile.ch.specialNext.y);
            sleep(4000);
            
            if (profile.ch.carPickMode == "up" || profile.ch.carPickMode == "down")
            {
                if (profile.ch.carPickMode == "up")
                    robot.click(profile.width/2, profile.garage.firstCar.y);
                else
                    robot.click(profile.width/2, profile.garage.firstCar.y + profile.garage.distance.y);
                sleep(2000);
                
                if (IsFlashingButton(profile.garage.start, 7) || IsFlashingButton(profile.garage.istart, 7))
                {
                    robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                    return true;
                }
    
                toastLog("\nNo fuel.");
                base.back();
                sleep(1500);
                base.back();
                sleep(1500);
            }
            
            if (profile.ch.carPickMode == "flat")
            {     
                var FOUND = hasFuelFlat(profile.ch.carPick, profile.ch.carPickSwipeLimit);
                //log("chooseCar>> FOUND = " + FOUND);            
                if (FOUND){
                    // Find a car with gas
                    sleep(4000);
                    
                    // Check if car available fuel
                    if (IsFlashingButton(profile.garage.start, 7) || IsFlashingButton(profile.garage.istart, 7))
                    {
                        //log("chooseCar>> READY");
                        robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                        return true;
                    }
                }
                lastCar   = 0;    
                toastLog("No fuel.");
            }
            
            if (profile.ch.carPickMode == "flat-abc")
            {
                var FOUND = hasFuelFlatABC(profile.ch.carPick);

                log("chooseCar>> FOUND = " + FOUND);            
                if (FOUND){
                    // Find a car with gas
                    sleep(4000);
                    
                    // Check if car available fuel
                    if (IsFlashingButton(profile.garage.start, 7) || IsFlashingButton(profile.garage.istart, 7))
                    {
                        log("chooseCar>> READY");
                        robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                        return true;
                    }
                }
                toastLog("No fuel.");
                return false;   
            }
            return false;
        },  
        //----------------------------------------------------------------------
        run(cnt, option) {
                        
            var runTime = new Date().getTime();
            var tries = 0;
            var brkc = 4;
            var chStatus = "";
            var routeTime =  new Date().getTime();
            var nitroTime =  new  Date().getTime();
            var raceStart  = false;
            var raceTime =   null;
 
            //check nav data 
             var route = null;
            if (profile.ch.navigation != null)
                route = parseNavigation(profile.ch.navigation);
            
            var nitroTick = 200;
            if (option.nitroTick != null)
                nitroTick = option.nitroTick;

            var currentRoute = profile.huntSESignSet;

            // Check if you have reached the checkout interface
            while (true) {
                var nowTime = new Date().getTime();
                if ((nowTime - runTime) > 240000) {
                    Screenshot("ch-blocked");
                    toastLog("(ch-run)blocked!restart!" + chseCheckState(true));
                    robot.back();
                    sleep(2000);
                    robot.back();
                    sleep(2000);
                    robot.back();
                    sleep(2000);
                    break;
                }
                
                chStatus = chseCheckState();
                // exit conditions
                if (!(chStatus == "unknow" || chStatus == "race")) {
                    // waiting 3 times of no race condition
                    tries++;
                    if (tries > 2)
                    {
                        toastLog("mp-run exit with state = " + chStatus);
                        if (chStatus == "dialog")
                        {
                            robot.back();
                            sleep(2000);
                            robot.back();
                            sleep(2000);
                            robot.back();
                            sleep(2000);
                        }
                        break;
                    }
                }
                // If you have not finished running, you can still click on nitrogen
                else {
                    if (!raceStart && chStatus == "race")
                    {
                        raceStart = true;
                        raceTime =  new Date().getTime();
                    }
                    // reset accidental exit 
                    tries = 0;
                    /*brkc--;
                    if (brkc < 0)
                    {
                        brkc = 2;
                        PressBrake();
                    }*/
                    if (raceStart && route != null)
                    {
                        for (let i = 0; i < route.length; i++) {
                            let item = route[i];
                            if (!item.fire && (nowTime-raceTime) > item.time)
                            {
                                item.fire = true;

                                if (item.type == "drift")
                                    PressBrake(item.dur);

                                if (item.type == "drift-flash")
                                {
                                    PressBrake(item.dur);
                                    sleep(50);
                                    PressNitro();
                                    PressNitro();
                                }

                                if (item.type == "normal-nitro")
                                {
                                    PressNitro();
                                }

                                if (item.type == "perfect-nitro")
                                {
                                    PressNitro();
                                    sleep(750);
                                    PressNitro();
                                }

                                if (item.type == "double-nitro")
                                {
                                    PressNitro();
                                    sleep(300);
                                    PressNitro();
                                }

                                if (item.type == "flash")
                                {
                                    PressNitro();
                                    PressNitro();
                                }

                                if (item.type == "360")
                                {
                                    PressBrake();
                                    PressBrake();
                                }

                                if (item.type == "360-flash")
                                {
                                    PressBrake();
                                    PressBrake();
                                    sleep(50);
                                    PressNitro();
                                    PressNitro();
                    }

                                if (item.type == "route")
                                    currentRoute = item.path
                            }
                        }
                    }

                    if ((nowTime - nitroTime) > nitroTick)
                    {   
                        nitroTime = new Date().getTime();
                    PressNitro();
                    }
                    if (currentRoute && (nowTime - routeTime) > 2000)
                    {
                        var t = SignClicker(currentRoute, routeRegion);
                        if (t)
                        {
                            routeTime =  new Date().getTime();
                    }
                }
                }
                sleep(100);
            }
            toastLog(++cnt.CH + " car hunt done, t.avg" +parseInt((nowTime - startTime)/1000/cnt.CH)+" second.");
        },
        //----------------------------------------------------------------------   
        test(option) {
            toastLog("chCheckState " + chseCheckState());
            //var img = captureScreen();
            //toastLog(PrintPixel(img, {x: 2130, y: 81, color: "#39393b"}));
        },
        state()
        {   
            return chseCheckState();
        }
    }
}
//------
function mpCheckState(debug) {

    var state = "unknow";

    var _img = captureScreen();
    var img = images.copy(_img);
    
    var isToken = isEquals(img, profile.common.token);
    var isCredit = isEquals(img, profile.common.credit);
    
    // Back button
    var isBack = isSimilar(img, profile.common.back, 5) && isSimilar(img, profile.common.backward, 5);
    
    // Multiplayer start button
    var start = images.pixel(img, profile.mp.start.x, profile.mp.start.y);
    var isStart = isEquals(img, profile.mp.start) || 
        (colors.red(start) < colors.green(start) && 
         colors.blue(start) < colors.green(start) && 
         colors.green(start) > 250 && 
         isButtonEdge(img, profile.mp.reward) && 
         isButtonEdge(img, profile.mp.rate) && 
         isButtonEdge(img, profile.mp.stage));
    
    var isGames = isNetworkGames(img);
   
    var isNetworkPage = isMarker(img, profile.networkPage, profile.common.pagesMarker);
   
    var racePause = isSimilar(img, profile.common.racePause, 3);
    var raceTD = isSimilar(img, profile.common.raceTD, 5);
    var raceTime = isSimilar(img, profile.common.raceTime, 20);
    var isRace = racePause && raceTD && raceTime; 
    
    // Continue button
    var isNext = isButtonEdge(img, profile.mp.continue1, true) 
              || isButtonEdge(img, profile.mp.continue2, true) 
              || isButtonEdge(img, profile.mp.continue3, true)
              || isButtonEdge(img, profile.mp.continue4, true)
              || isButtonEdge(img, profile.mp.continue5, true)
              || isButtonEdge(img, profile.mp.continue6, true);
    
    // Various dialogs
    var errorleft = isSimilar(img, profile.mp.errorleft, 3);
    var errorright = isSimilar(img, profile.mp.errorright, 3);
    // club invite
    var clubleft = isButtonEdge(img, profile.mp.clubleft);
    var clubright = isButtonEdge(img, profile.mp.clubright);
    // league downgrade
    var downgradeLeft = isSimilar(img, profile.mp.leaguedownleft, 5);
    var downgradeRight = isSimilar(img, profile.mp.leaguedownright, 5);
    // network error
    var networkErrorLeft = isSimilar(img, profile.mp.networkErrorLeft, 3);
    var networkErrorRight = isSimilar(img, profile.mp.networkErrorRight, 3);

    var isDialog = (errorleft && errorright) || (clubleft && clubright) || (downgradeLeft && downgradeRight) || (networkErrorLeft && networkErrorRight);

    if (debug) 
    {
        var txt = "";
        
        if (isToken)
			txt += "Token ";

		if (isCredit)
			txt += "Credit ";
        
        if (isBack)
            txt += "Back ";
        
        if (isGames)
            txt += "Game" + profile.networkGamesCount + " ";
        
        if (isNetworkPage)
            txt += "Network ";
            
        if (isRace)
            txt += "Race ";    
        
        if (isDialog)
            txt += "Dialog ";
        
        return txt;    
    }
    
    if (isDialog)
        state = "dialog";
        
    else if (isToken && isCredit && !isBack && !isStart && /*isGames &&*/ isNetworkPage)
        state = "home";

    else if (isToken && isCredit && !isBack && !isNetworkPage && !isStart)
        state = "index";
    
    else if (isToken && isCredit && isBack && isStart)
        state = "start";
    
    else if (!isToken && !isCredit && !isBack && isRace)
        state = "race";
        
    else if (isNext && !isCredit && !isToken)
        state = "next";

    return state;
}
//------
function chCheckState(debug) {

    var state = "unknow";

    var _img = captureScreen();
    var img = images.copy(_img);
    
    var isToken = isEquals(img, profile.common.token);
    var isCredit = isEquals(img, profile.common.credit);
    
    // Back button
    var isBack = isSimilar(img, profile.common.back, 5) && isSimilar(img, profile.common.backward, 5);
    
    var pageSelected = getMarker(img, profile.common.pagesMarker);
    var isEventPage = pageSelected == profile.eventPage;
    
    var eventSelected = getMarker(img, profile.common.eventsMarker);
    //var isEventHome = eventSelected == 1;
    //var isCarHunt = eventSelected == profile.carHuntPosition;
    
    // carhunt start button
    var start = images.pixel(img, profile.ch.start.x, profile.ch.start.y);
    var isStart = isEquals(img, profile.ch.start);
     
    var racePause = isSimilar(img, profile.common.racePause, 3);
    var raceTD = isSimilar(img, profile.common.raceTD, 3);
    var raceTime = isSimilar(img, profile.common.raceTime, 20);
    var isRace = racePause && raceTD && raceTime; 
    
    // Continue button
    var isNext = isButtonEdge(img, profile.mp.continue1, true) 
              || isButtonEdge(img, profile.mp.continue2, true) 
              || isButtonEdge(img, profile.mp.continue3, true)
              || isButtonEdge(img, profile.mp.continue4, true)
              || isButtonEdge(img, profile.mp.continue5, true)
              || isButtonEdge(img, profile.mp.continue6, true)
              || isButtonEdge(img, profile.mp.continue7, true)
              || isButtonEdge(img, profile.mp.continue8, true);
              
    // Various dialogs
    var errorleft = isSimilar(img, profile.mp.errorleft, 3);
    var errorright = isSimilar(img, profile.mp.errorright, 3);
    
    var noTicketLeft = isSimilar(img, profile.ch.noTicketLeft, 3);
    var noTicketRight = isSimilar(img, profile.ch.noTicketRight, 3);
    
    var isDialog = (errorleft && errorright) || (noTicketLeft && noTicketRight) ;

    if (debug) 
    {
        var txt = "";
        if (isToken)
			txt += "Token ";

		if (isCredit)
			txt += "Credit ";
        
        if (isBack)
            txt += "Back ";
        
        txt += "Page" + pageSelected + " ";
        txt += "Event" + eventSelected + " ";
        
        if (isStart)
            txt += "Start ";
                
        if (isRace)
            txt += "Race ";    
        
        if (isDialog)
            txt += "Dialog ";
                            
        return txt;
    }
    
    if (isDialog)
        state = "dialog";
        
    else if (isToken && isCredit && !isBack && isEventPage)
        state = "home";

    else if (isToken && isCredit && !isBack && !isEventPage)
        state = "index";
    
    else if (isToken && isCredit && isBack && (pageSelected == 0) && !isStart)
        state = "events";
    
    //else if (isToken && isCredit && isBack && (pageSelected == 0) && isCarHunt && !isStart)
    //    state = "hunt";

    else if (isToken && isCredit && isBack && (pageSelected == 0) && (eventSelected == 0) && isStart)
        state = "start";
                
    else if (!isToken && !isCredit && !isBack && isRace)
        state = "race";
        
    else if (isNext && !isCredit && !isToken)
        state = "next";

    return state;              
}
//------
function chseCheckState(debug) {

    var state = "unknow";

    var _img = captureScreen();
    var img = images.copy(_img);
    
    var isToken = isEquals(img, profile.common.token);
    var isCredit = isEquals(img, profile.common.credit);
    
    // Back button
    var isBack = isSimilar(img, profile.common.back, 5) && isSimilar(img, profile.common.backward, 5);
    
    var pageSelected = getMarker(img, profile.common.pagesMarker);
    var isSpecialPage = (pageSelected == profile.specialPage);
    
    var isEventHome = isEquals(img, profile.ch.specialSelector);
    //var isEventSelected = isEquals(img, profile.ch.specialSelected);
    var isCarHunt = isEquals(img, profile.ch.specialHunt);

    // carhunt start button
    var start = images.pixel(img, profile.ch.specialNext.x, profile.ch.specialNext.y);
    var isStart = isEquals(img, profile.ch.specialNext);
     
    var racePause = isSimilar(img, profile.common.racePause, 3);
    var raceTD = isSimilar(img, profile.common.raceTD, 3);
    var raceTime = isSimilar(img, profile.common.raceTime, 20);
    var isRace = racePause && raceTD && raceTime; 
    
    // Continue button
    var isNext = isButtonEdge(img, profile.mp.continue1, true) 
              || isButtonEdge(img, profile.mp.continue2, true) 
              || isButtonEdge(img, profile.mp.continue3, true)
              || isButtonEdge(img, profile.mp.continue4, true)
              || isButtonEdge(img, profile.mp.continue5, true)
              || isButtonEdge(img, profile.mp.continue6, true);
              
    // Various dialogs
    var errorleft = isSimilar(img, profile.mp.errorleft, 3);
    var errorright = isSimilar(img, profile.mp.errorright, 3);
    
    var noTicketLeft = isSimilar(img, profile.ch.noTicketLeft, 3);
    var noTicketRight = isSimilar(img, profile.ch.noTicketRight, 3);
    
    var isDialog = (errorleft && errorright) || (noTicketLeft && noTicketRight) ;

    if (debug) 
    {
        var txt = "";
        if (isToken)
            txt += "Token ";

        if (isCredit)
            txt += "Credit ";
        
        if (isBack)
            txt += "Back ";
        
        txt += "Page" + pageSelected + " ";
        //txt += "Event" + eventSelected + " ";
        txt += "spec = " + isSpecialPage + " ";
        if (isStart)
            txt += "Start ";
                
        if (isRace)
            txt += "Race ";    
        
        if (isDialog)
            txt += "Dialog ";
                            
        return txt;
    }
    
    if (isDialog)
        state = "dialog";
        
    else if (isToken && isCredit && !isBack && isSpecialPage /*&& !isEventSelected*/)
        state = "home";

    else if (isToken && isCredit && !isBack && !isSpecialPage)
        state = "index";
    
    else if (isToken && isCredit && !isBack && isSpecialPage /*&& isEventSelected*/ && !isCarHunt)
        state = "events";
    
    else if (isToken && isCredit && isBack && isCarHunt)
        state = "hunt";

    else if (isToken && isCredit && isBack && isStart)
        state = "start";
                
    else if (!isToken && !isCredit && !isBack && isRace)
        state = "race";
        
    else if (isNext && !isCredit && !isToken)
        state = "next";

    return state;              
}
//------
function hasFuelABC(level, cars)
{
    log('checkFuel(' + level + ')');
    selectNextLeague(level);
    sleep(1000);
    var cars = getLeagueCars(level, cars);
    var startTime = new Date().getTime();

    //last bottom car
    log('click last bottom car');
    robot.click( 1050, 800);
    sleep(2000);

    nowTime = new Date().getTime();
    while((nowTime - startTime) < (2*60000)) {
        nowTime = new Date().getTime();

        var _img = captureScreen();
        var img = images.copy(_img);

        if (CarCanGo(img))
        {    
            var currCarStar = GetCarStar(img);
            var currCarClass = GetCarClass(img);

            for (let i = 0; i < cars.length; i++) {
                let car = cars[i];
                if (currCarClass == car[0])
                {
                    if (currCarStar >= parseInt(car[1], 10))
                    {
                        return true;
                    }
                }
            }
        }
        //prev car
        robot.click( 818, 538);
        sleep(profile.garage.switchSpeed);
    }        
    return false;
}
function hasFuelFlatABC(cars)
{
    log('checkFuel(Flat-ABC)');
    //selectNextLeague(level);
    //sleep(1000);
    //var cars = getLeagueCars(level, cars);
    var startTime = new Date().getTime();

    //last bottom car
    log('click last bottom car');
    robot.click( 1000, 800);
    sleep(2000);

    nowTime = new Date().getTime();
    while((nowTime - startTime) < (2*60000)) {
        nowTime = new Date().getTime();

        var _img = captureScreen();
        var img = images.copy(_img);

        if (CarCanGo(img))
        {    
            var currCarStar = GetCarStar(img);
            var currCarClass = GetCarClass(img);

            for (let i = 0; i < cars.length; i++) {
                let car = cars[i];
                if (currCarClass == car[0])
                {
                    if (currCarStar >= parseInt(car[1], 10))
                    {
                        return true;
                    }
                }
            }
        }
        //prev car
        robot.click( 818, 538);
        sleep(profile.garage.switchSpeed);
    }        
    return false;
}
//------
function CarCanGo(img)
{
    return isSimilar(img, profile.garage.canGo1, 3) && !(isEquals(img, profile.garage.cantGo1) || isEquals(img, profile.garage.cantGo2));;
}
//------
function GetCarStar(img)
{
    var currStar = 0;

    if (isSimilar(img, profile.garage.star6, 3))
        currStar = 6;
    else if (isSimilar(img, profile.garage.star5, 3))
        currStar = 5;
    else if (isSimilar(img, profile.garage.star4, 3))
        currStar = 4;
    else if (isSimilar(img, profile.garage.star3, 3))
        currStar = 3;
    else if (isSimilar(img, profile.garage.star2, 3))
        currStar = 2;
    else if (isSimilar(img, profile.garage.star1, 3))
        currStar = 1;
    return currStar;
}
//------
function GetCarClass(img)
{
    var _img = captureScreen();
    var img = images.copy(_img);
    var currClass = 'D';

    if (isSimilar(img, profile.garage.isClassA, 5))
    {    
        currClass = 'A';
    }
    else if (isSimilar(img, profile.garage.isClassBS, 5))
    {
        if (isSimilar(img, profile.garage.isClassB, 5))
            currClass = 'B';    
        else
            currClass = 'S'; 
    }
    else 
    {
        if (isSimilar(img, profile.garage.isClassD, 5))
            currClass = 'D';    
        else
            currClass = 'C'; 
    }
    return currClass;
}
//------
function hasFuel(level, cars, swipeLimit) {
    log('checkFuel(' + level + ')');
    var firstCar = profile.garage.firstCar;
    var distance = profile.garage.distance;
    //selectLeague(level);
    var cars = getLeagueCars(level, cars);
    //log(cars.length);
    
    // Looking for a car with gas
    for (let i = lastCar; i < cars.length; i++) {
        let n = cars[i];
		selectLeague(level);
        sleep(1000);
        var carPoint = locateCar(n, swipeLimit, firstCar, distance);

        sleep(1000);
        var _img = captureScreen();
        var img = images.copy(_img);
        log(PrintPixel(img, carPoint));
        var carcheckState = images.pixel(img, carPoint.x, carPoint.y);
        
        if (colors.equals(carcheckState, firstCar.colorFull)) {
            lastCar = i;
            //robot.click( carPoint.x + ((distance.x + distance.inertia) / 2) , parseInt(carPoint.y - distance.y / 2 ));
            robot.click( carPoint.x + 20, carPoint.y - 20);
            toastLog(level+"-car-("+n+")-has-fuel");
            return true;
        }
        else {
            lastCar = 0;
            //toastLog(colors.toString(carcheckState));
            toastLog(level+"-car-("+n+")-has-NO-fuel");
        }
    }        
    return false;
}
//------
function hasFuelFlat(cars, swipeLimit) {
    log('checkFuel');
    var firstCar = profile.garage.firstCarFlat;
    var distance = profile.garage.distanceFlat;
    
    // Looking for a car with gas
    for (let i = lastCar; i < cars.length; i++) {
        let n = cars[i];
		swipeToBegin();
        sleep(1000);
        //log('car = ' + n);   
		/*swipes = parseInt( ( n - 1) / 2 );
        var sLock = 0;
        if (swipeLimit && swipes > swipeLimit)
        {    
            sLock = swipes - swipeLimit;
            swipes = swipeLimit;
        }
        // slide left required number of times
		for(let j = 0; j < swipes; j++) {
		    //let dur = 2000;
		    sleep(500);
		    toast("<---");
		    robot.swipe(firstCar.x + distance.x + distance.inertia, firstCar.y, firstCar.x, firstCar.y, profile.garage.swipeDuration);
		    sleep(500);
		}
						  
        var carPoint = {
            x: firstCar.x + (sLock * distance.x),
            y: firstCar.y + distance.y * ((n - 1) % 2)
        }*/
        var carPoint = locateCar(n, swipeLimit, firstCar, distance);

        sleep(1000);
        var _img = captureScreen();
        var img = images.copy(_img);
        log(PrintPixel(img, carPoint));
        var carcheckState = images.pixel(img, carPoint.x, carPoint.y);

        if (colors.equals(carcheckState, firstCar.colorFull)) {
            lastCar = i;
            robot.click( carPoint.x + ((distance.x + distance.inertia) / 2) , parseInt(carPoint.y - distance.y / 2 ));
            toastLog("car-("+n+")-has-fuel");
            return true;
        }
        else {
            lastCar = 0;
            //toastLog(colors.toString(carcheckState));
            toastLog("car-("+n+")-has-NO-fuel");
        }
    }        
    return false;
}

function locateCar(carNum, swipeLimit, firstCar, distance)
{
    swipes = parseInt( ( carNum - 1) / 2 );
    var sLock = 0;
    if (swipes > swipeLimit)
    {    
        sLock = swipes - swipeLimit;
        swipes = swipeLimit;
        log("swipeLimit = " + swipeLimit + "  sLock = " + sLock + "  swipes = " + swipes); 
    }
    // slide left required number of times
    for(let j = 0; j < swipes; j++) {
        //let dur = 2000;
        sleep(500);
        toast("<---");
        robot.swipe(firstCar.x + distance.x + distance.inertia, firstCar.y, firstCar.x, firstCar.y, profile.garage.swipeDuration);
        sleep(500);
    }
                      
    return {
        x: firstCar.x + (sLock * distance.x),
        y: firstCar.y + distance.y * ((carNum - 1) % 2)
    }
}
//------
//from mp start screen
function getCurrentLeagueLevel()
{
	var league = images.pixel(captureScreen(), profile.garage.league.x, profile.garage.league.y);
	
    if (colors.isSimilar(league, profile.garage.league.colorUnranked, 5, "diff"))
	{
		return 4;
	}
	if (colors.isSimilar(league, profile.garage.league.colorBronze, 5, "diff"))
	{
		return 4;
	}
	if (colors.isSimilar(league, profile.garage.league.colorSilver, 5, "diff"))
	{
		return 3;
	}
	if (colors.isSimilar(league, profile.garage.league.colorGold, 5, "diff"))
	{
		return 2;
	}
    if (colors.isSimilar(league, profile.garage.league.colorPlatinum, 5, "diff"))
	{
		return 1;
	}
    if (colors.isSimilar(league, profile.garage.league.colorLegend, 5, "diff"))
	{
		return 0;
	}
	return 0;
}
//------
function swipeToBegin()
{
    let slp = 500;
    for(let j = 0; j < 8; j++) {
        toast("--->");
        sleep(slp);
        robot.swipe(profile.width / 5, profile.garage.firstCar.y, (profile.width / 5) * 4, profile.garage.firstCar.y, 400);
        sleep(slp);
    }
    sleep(slp);
    robot.swipe(profile.width / 5, profile.garage.firstCar.y, (profile.width / 5) * 4, profile.garage.firstCar.y, 700);
    sleep(slp);
}
//------
function selectLeague(level)
{
    // Assign a value to cars[]
    if (level == 'legend'){
        robot.click(profile.garage.legend.x, profile.garage.legend.y);
    } else if (level == 'platinum'){
        robot.click(profile.garage.platinum.x, profile.garage.platinum.y);
    } else if (level == 'gold'){
        robot.click(profile.garage.gold.x, profile.garage.gold.y);
    } else if (level == 'silver'){
        robot.click(profile.garage.silver.x, profile.garage.silver.y);
    } else if (level == 'bronze'){
        robot.click(profile.garage.bronze.x, profile.garage.bronze.y);
    } 
}
//------
function selectNextLeague(level)
{
    // Assign a value to cars[]
    if (level == 'legend'){
        log('click legend league');
        robot.click(profile.garage.legend.x, profile.garage.legend.y);
    } else if (level == 'platinum'){
        log('click legend league');
        robot.click(profile.garage.legend.x, profile.garage.legend.y);
    } else if (level == 'gold'){
        log('click platinum league');
        robot.click(profile.garage.platinum.x, profile.garage.platinum.y);
    } else if (level == 'silver'){
        log('click gold league');
        robot.click(profile.garage.gold.x, profile.garage.gold.y);
    } else if (level == 'bronze'){
        log('click silver league');
        robot.click(profile.garage.silver.x, profile.garage.silver.y);
    } else {
        log('click silver league');
        robot.click(profile.garage.silver.x, profile.garage.silver.y);
    }
}
//------
function getLeagueCars(level, cars)
{
    if (level == 'legend'){
        return cars.legend;
    } else if (level == 'platinum'){
        return cars.platinum;
    } else if (level == 'gold'){
        return cars.gold;
    } else if (level == 'silver'){
        return cars.silver;
    } else if (level == 'bronze'){
        return cars.bronze;
    } 
}
//------
function pressMarkerButton(num, data)
{
    var mrkY = data.y + data.pressYOffset; 
    //log('pressMarkerButton ' + num)
    if (num > 0)
    {
        if (num > 8)
        {
            var swipes = num - 8;
            // slide left required number of times
            for(let j = 0; j < swipes; j++) {
                sleep(500);
                toast("<---");
                robot.swipe(1000, mrkY, 1000 - (data.delta + profile.garage.distance.inertia), mrkY, 510);
                sleep(500);
            }

            var x = data.x + (num - 1 - swipes)*data.delta + data.pressXOffset;
            var y = data.y + data.pressYOffset;
            //toastLog("x: " + x + " y: " + y);
            robot.click(x, y);
            sleep(2500);
            robot.click(x, y);
        }
        else
        {
            var x = data.x + (num -1)*data.delta + data.pressXOffset;
            var y = data.y + data.pressYOffset;
            //toastLog("x: " + x + " y: " + y);
            robot.click(x, y);
            sleep(2500);
            robot.click(x, y);
        }
    } else {
        
        for(let j = 0; j < 5; j++) {
            robot.swipe(2000, mrkY, 500, mrkY, 400);
             sleep(500);
        }
        sleep(1500); 
        var x = profile.width - data.x - (-1*num -1)*data.delta + data.pressXOffset;
        var y = data.y + data.pressYOffset;
        toastLog("x: " + x + " y: " + y);
        robot.click(x, y);
        sleep(2500);
        robot.click(x, y);
    }
}
//------
function getMarker(img, data)
{
    for ( let i = 1; i <= 6; i++ )
    { 
        if (isMarker(img, i, data))
        {
            return i;
        }
    }
    return 0;
}
//------
function isMarker(img, num, data)
{
    var x = data.x + (num -1)*data.delta; 
    var p = images.pixel(img, x, data.y);
    //return colors.equals(p, data.color);
    return colors.isSimilar(p, data.color, 6, "diff");
}
//------
function isNetworkGames(img)
{
    if (profile.networkGamesCount == 2)
    {
        var isGame1 = isSimilar(img, profile.mp.game1of2, 5);
        var isGame2 = isSimilar(img, profile.mp.game2of2, 5);
        return isGame1 && isGame2;
    }
    
    return false;
}
//------
function isSimilar(img, point, threshold)
{
    var pixel = images.pixel(img, point.x, point.y);
    return colors.isSimilar(pixel, point.color, threshold, "diff");
}
//------
function isEquals(img, point)
{
    var pixel = images.pixel(img, point.x, point.y);
    return colors.equals(pixel, point.color);
}
//------
function isButtonEdge(img, point, debug)
{
    var pixel = images.pixel(img, point.x, point.y);
    var pixelOut = images.pixel(img, point.x-10, point.y-10);
    if (debug){
        log(PrintPixel(img, point));
    }
    return colors.equals(pixel, point.color) && !colors.equals(pixelOut, point.color);
}
//------
function IsFlashingButton(point, timeoutSec)
{
    var runTime = new Date().getTime();            
    var tries = 0;
    while (true) {
        var nowTime = new Date().getTime();
        if ((nowTime - runTime) > timeoutSec * 1000) {
            break;
        }
        // Check if car available fuel
        var _img = captureScreen();
        var img = images.copy(_img);
        if (isSimilar(img, point, 10))
            tries++;

        if (tries > 2)
            return true;

        sleep(111);
    }
    return false;    
}
//------
function ImageFinder(folder, region)
{
    //var folder = profile.adCloserFolder;
    if (!folder)
        return false;
    var list = files.listDir(folder);
    var len = list.length;
    if(len > 0){
        var _img = captureScreen();
        var imgad = images.copy(_img);
        for(let i = 0; i < len; i++){
            var fileName = list[i];
            if (fileName.toLowerCase().endsWith(".png") || fileName.toLowerCase().endsWith(".jpg"))
            {
                var templatePath = files.join(folder, fileName);
                var template = images.read(templatePath);
                var pos = null;
                if (region)
                    pos = images.findImage(imgad, template, {threshold:0.85, region: region});
                else
                    pos = images.findImage(imgad, template, {threshold:0.85});    
                width = template.getWidth();
                height = template.getHeight();
                template.recycle();
                if(pos){
                    imgad.recycle();
                    return true
                }  
            }
        }
        imgad.recycle();
    }
    return false
}
//------
function SignClicker(filter, region)
{
    //var folder = profile.adCloserFolder;
    if (!filter)
        return false;

    let folder = profile.signsFolder;

    var list = filter.split(',');;
    var len = list.length;
    if(len > 0){
        var _img = captureScreen();
        var imgad = images.copy(_img);
        for(let i = 0; i < len; i++){
            var fileName = files.join(folder, list[i].trim()+'.png');
            log(fileName);
            var sign = images.read(fileName);
            var pos = null;
            if (region)
                pos = images.findImage(imgad, sign, {threshold:0.8, region: region});
            else
                pos = images.findImage(imgad, sign, {threshold:0.8});    
            width = sign.getWidth();
            height = sign.getHeight();
            sign.recycle();
            if(pos){

                var middle = {
                    x: Math.round(pos.x + width/2), 
                    y: Math.round(pos.y + height/2)
                };
                robot.click(middle.x, middle.y);
                log('Click button ' + fileName + ' ' + middle.x + ', ' +  middle.y)
                //sleep(2000)
                return true;
            }  

        }
        imgad.recycle();
    }
    return false
}
//------
function ImageClicker(folder, region)
{
    //var folder = profile.adCloserFolder;
    if (!folder)
        return false;
    var list = files.listDir(folder);
    var len = list.length;
    if(len > 0){
        var _img = captureScreen();
        var imgad = images.copy(_img);
        for(let i = 0; i < len; i++){
            var fileName = list[i];
            if (fileName.toLowerCase().endsWith(".png") || fileName.toLowerCase().endsWith(".jpg"))
            {
                var templatePath = files.join(folder, fileName);
                var template = images.read(templatePath);
                var pos = null;
                if (region)
                    pos = images.findImage(imgad, template, {threshold:0.8, region: region});
                else
                    pos = images.findImage(imgad, template, {threshold:0.8});    
                width = template.getWidth();
                height = template.getHeight();
                template.recycle();
                if(pos){

                    var middle = {
                        x: Math.round(pos.x + width/2), 
                        y: Math.round(pos.y + height/2)
                    };
                    robot.click(middle.x, middle.y);
                    log('Click button ' + fileName + ' ' + middle.x + ', ' +  middle.y)
                    //sleep(2000)
                    return true
                }  
            }
        }
        imgad.recycle();
    }
    return false
}
//------
function FindImage(folder, fileName, region)
{
    if (!folder)
        return null;
    var path = files.join(folder, fileName);
    if (!files.isFile(path))
        return null;
    var _img = captureScreen();
    var imgad = images.copy(_img);
    var template = images.read(path);
    var pos = null;
    if (region)
        pos = images.findImage(imgad, template, {threshold:0.8, region: region});
    else
        pos = images.findImage(imgad, template, {threshold:0.8});    
    width = template.getWidth();
    height = template.getHeight();
    template.recycle();
    if(pos){

        var middle = {
            x: Math.round(pos.x + width/2), 
            y: Math.round(pos.y + height/2)
        };
        return middle;
    } 
    return null;
}
//------
function PrintPixel(img, point)
{
    var txt = "x: " +  point.x + " y: " +  point.y;
    var color =  images.pixel(img, point.x, point.y);
    return txt + "\ncolor: " + colors.toString(color);
}
//------
function Screenshot(name)
{
    var fn = name || "screencapture";
    // Save to storage
    var time = new Date().getTime();
    var img = captureScreen("/storage/emulated/0/Pictures/Screenshots/"+fn+"-"+time+".png");
}
//------
function PressNitro()
{
    robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
}
//------
function PressBrake(duration) {
    if (duration > 0) {
        robot.press(profile.width * 1 / 5, profile.height / 2, duration);
    } else {
        robot.click(profile.width * 1 / 5, profile.height / 2);
    }
}
//------
function parseNavigation(nav)
{
    var res = [];
    if (nav != null)
    {
        for (let i = 0; i < nav.length; i++) {
            let navParams = nav[i].split('|');
            if (navParams[1] == "drift")
            {
                res.push({
                    fire: false, 
                    type:"drift", 
                    time: parseInt(navParams[0], 10), 
                    dur: parseInt(navParams[2], 10)});
            }
            if (navParams[1] == "drift-flash")
            {
                res.push({
                    fire: false, 
                    type:"drift-flash", 
                    time: parseInt(navParams[0], 10), 
                    dur: parseInt(navParams[2], 10)});
            }
            if (navParams[1] == "normal-nitro")
            {
                res.push({
                    fire: false, 
                    type:"normal-nitro", 
                    time: parseInt(navParams[0], 10)});
            }
            if (navParams[1] == "perfect-nitro")
            {
                res.push({
                    fire: false, 
                    type:"perfect-nitro", 
                    time: parseInt(navParams[0], 10)});
            }
            if (navParams[1] == "double-nitro")
            {
                res.push({
                    fire: false, 
                    type:"double-nitro", 
                    time: parseInt(navParams[0], 10)});
            }                    
            if (navParams[1] == "flash")
            {
                res.push({
                    fire: false, 
                    type:"flash", 
                    time: parseInt(navParams[0], 10)});
            }
            if (navParams[1] == "360")
            {
                res.push({
                    fire: false, 
                    type:"360", 
                    time: parseInt(navParams[0], 10)});
            }
            if (navParams[1] == "360-flash")
            {
                res.push({
                    fire: false, 
                    type:"360-flash", 
                    time: parseInt(navParams[0], 10)});
            }
            if (navParams[1] == "route")
            {
                let newSigns = "";
                if (navParams.length >= 3)
                    newSigns = navParams[2];
                res.push({
                    fire: false, 
                    type:"route", 
                    time: parseInt(navParams[0], 10), 
                    path: newSigns});
            }
        }
    }
    return res;
}
//------
function SignAllowed(arr, item){
    if (!arr || !item)
        return false;

    for(let i = 0; i < arr.length; i++){
        if (arr[i].trim()+'.png' == item.trim())
            return true;
    }
    return false;
}
//------
function CloseApp()
{
    robot.swipe(2340, 600, 1000, 610, 200);
    sleep(2000);
    robot.click(2270, 780);
    sleep(3000);
    robot.swipe(1200, 600, 100, 611, 200);
    sleep(2000); 
}
//------
function Restart(appName){
    log("Restart>> " + appName);
    openAppSetting(getPackageName(appName));
    sleep(3500);

    // close
    robot.click(950, 1020);
    sleep(1000);

    // ok
    robot.click(1372, 770);
    sleep(1000);

    launchApp(appName);
    sleep(50000);

    c = 0;
    var res = mpCheckState();
    while(res == "unknow") {
        robot.swipe(2000, 400, 500, 400, 400);
        sleep(1000); 
        if (!ImageClicker('./AdCloser2/'))
            robot.back();
        sleep(5000); 
        res = mpCheckState();   
    }
}
//------
function RestartWithReset(appName){
    log("Restart>> " + appName);
    openAppSetting(getPackageName(appName));
    sleep(3500);

    // close
    robot.click(950, 1020);
    sleep(1000);

    // ok
    robot.click(1372, 770);
    sleep(1000);

    // safe cache
    shell("mv /mnt/sdcard/Android/obb/com.gameloft.android.ANMP.GloftA9HM /mnt/sdcard/Android/obb/com.gameloft.android.ANMP1.GloftA9HM", false);

    // clear
    robot.click(1330, 1020);
    sleep(1000);

    // clear all
    robot.click(800, 467);
    sleep(1000);
    
    // ok
    robot.click(1372, 770);
    sleep(1000);
    
    // restore cache
    shell("mv /mnt/sdcard/Android/obb/com.gameloft.android.ANMP1.GloftA9HM /mnt/sdcard/Android/obb/com.gameloft.android.ANMP.GloftA9HM", false);
    
    /*
    var c = 0;
    openAppSetting(getPackageName(appName));
    sleep(500);
    while(!click("ОСТАНОВИТЬ")) {
        if (c++ > 6) {
           toastLog("kill V timeout!");
           break;
        }
        sleep(5000);
    }
    c = 0;
    sleep(500);
    while(!click("ОК")) {
        if (c++ > 3) {
            toastLog("confirm V timeout!");
            break;
        }
        sleep(5000);
    }
    
    shell("am force-stop com.gameloft.android.ANMP.GloftA9HM", false);
    sleep(1000);
    shell("mv /mnt/sdcard/Android/obb/com.gameloft.android.ANMP.GloftA9HM /mnt/sdcard/Android/obb/com.gameloft.android.ANMP1.GloftA9HM", false);
    sleep(500);
    shell("pm clear com.gameloft.android.ANMP.GloftA9HM", false);
    sleep(500);
    shell("mv /mnt/sdcard/Android/obb/com.gameloft.android.ANMP1.GloftA9HM /mnt/sdcard/Android/obb/com.gameloft.android.ANMP.GloftA9HM", false);
    sleep(500);  */
    launchApp(appName);
    sleep(5000);
    robot.click(1750, 1015); //choose 4g
    sleep(5000);
    robot.click(1750, 1015); //choose 4g
    sleep(5000);
    robot.click(1750, 1015); //choose 4g
    sleep(35000);
    //---------------
    // I N I I T
    
    robot.click(770, 188); //age editor
    sleep(1000);
    
    robot.click(900,670); //2
    sleep(1000);
    
    robot.click(900,670); //2
    sleep(1000);
    
    robot.click(1960, 1015); //ok
    sleep(1000);
    
    robot.click(215, 697); //v
    sleep(1000);
    
    robot.click(1170, 968); //принять
    sleep(1000);
    
    robot.click(1158, 985); //принять
    sleep(15000);
    
    if (profile.accountType == "google")
    {
        robot.click(701, 300); //google
        sleep(10000);
    }
    if (profile.accountType == "facebook")
    {
        robot.click(701, 710); //facebook
        sleep(7000);
    
        robot.click(1162, 995); //as user
        sleep(15000);
    }
    
    robot.click(2100, 875); //switch acc B
    sleep(5000);
    
    robot.click(578, 761); //yes
    sleep(20000);
    
    for(let j = 0; j < 5; j++) {
        robot.swipe(2000, 400, 500, 400, 400);
        sleep(500);
    } 
    
    c = 0;
    sleep(500);
    var res = mpCheckState();
    while(res == "unknow") {
        robot.swipe(2000, 400, 500, 400, 400);
        sleep(1000); 
        if (!ImageClicker('./AdCloser2/'))
            robot.back();
        sleep(5000); 
        res = mpCheckState();   
    }
}