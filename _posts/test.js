function delayedFetch() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5500/", false);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };

    xhr.send(null);
}


function async_delayedFetch(sequence) {
    fetch("http://localhost:5500/")
        .then(response => console.log(`Fetched ${sequence}`))
        .catch(e => console.log(e));
}


function main_call() {
    console.log("HELLO");
    async_delayedFetch(0);
    console.log("world");
    async_delayedFetch(1);
    console.log("world2");
    async_delayedFetch(2);
    console.log("world3");
    async_delayedFetch(3);
}

main_call()