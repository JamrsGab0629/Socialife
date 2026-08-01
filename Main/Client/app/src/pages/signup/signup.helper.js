export default function Helper( counter ){
    const step = Number(localStorage.getItem('signup-step')) || 1;
    // console.log(counter, step);

    if( counter === step ) return;

    this.redirect(`/signup/${step}`);
}