let daysRef;
let hoursRef;
let minutesRef;
let secondsRef;

window.onload = () => {
  daysRef = document.getElementById("days");
  hoursRef = document.getElementById("hours");
  minutesRef = document.getElementById("minutes");
  secondsRef = document.getElementById("seconds");
  const [now, dogDaysDate] = getComparisonDates();
  if(sameDay(now,dogDaysDate)){
    showAnnouncement()
    return
  }
  setInterval(tick, 1000);
};

const calculateRemainingTime = () => {
  const [now, dogDaysDate] = getComparisonDates();

  const remainingMilis = dogDaysDate - now;
  const remainingSeconds = remainingMilis / 1000;

  //convert the seconds to days
  const days = Math.floor(remainingSeconds / (3600 * 24));

  //convert the seconds to hours and divide that by 24 getting the remainder,
  //the division will give us the days left but the remainder is the hours left from those days
  const hours = Math.floor((remainingSeconds / 3600) % 24);

  const minutes = Math.floor((remainingSeconds / 60) % 60);
  const seconds = Math.floor(remainingSeconds % 60);

  return [days, hours, minutes, seconds];
};

const tick = () =>{
    const [days,hours,minutes,seconds] = calculateRemainingTime()
    daysRef.innerText = Math.floor(days);
    hoursRef.innerText = Math.floor(hours);
    minutesRef.innerText = Math.floor(minutes);
    secondsRef.innerText = Math.floor(seconds);
}

const sameDay = (d1, d2) =>{
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const getComparisonDates = ( )=>{
    const now = new Date();
    const dogDaysDate = new Date(now.getFullYear()+1, 5, 1);
    return [now,dogDaysDate]
}

const showAnnouncement = () =>{
    const countdown = document.getElementById('countdown')
    const texts = document.getElementsByClassName('text')
    const announcement = document.getElementById('announcement')
    countdown.classList.add('hidden')
    for(const text of texts)
        text.classList.add('hidden')
    announcement.classList.remove('hidden')
}