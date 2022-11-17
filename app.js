let data3 = [];
async function getData1(url1, url2, fn) {
    let myPromise = new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url1 + fn, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    resolve(new Error(xhr.statusText));
                }
            }
        };
        xhr.send();
    })
    let data1 = await myPromise;
    //console.log(data1);
    for (let i in data1[1]) {
        let myPromise2 = new Promise(function (resolve) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url2 + data1[1][i], true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        resolve(new Error(xhr.statusText));
                    }
                }
            };
            xhr.send();
        })
        let data2 = await myPromise2;
        let arrKeys = Object.keys(data2.query.pages);
        let id = arrKeys[0];
        let obj = {};
        if (data2.query.pages[id].hasOwnProperty('thumbnail')) {
            if (data2.query.pages[id].pageprops['wikibase-shortdesc']) {
                obj = {
                    source: data2.query.pages[id].thumbnail.source,
                    title: data1[1][i],
                    short: data2.query.pages[id].pageprops['wikibase-shortdesc'],
                    url: data1[3][i]
                }
            }
            else {
                obj = {
                    source: data2.query.pages[id].thumbnail.source,
                    title: data1[1][i],
                    short: 'none',
                    url: data1[3][i]
                }
            }
        }
        else {
            if (data2.query.pages[id].pageprops['wikibase-shortdesc']) {
                obj = {
                    source: '/image/Capture.PNG',
                    title: data1[1][i],
                    short: data2.query.pages[id].pageprops['wikibase-shortdesc'],
                    url: data1[3][i]
                }
            }
            else {
                obj = {
                    source: '/image/Capture.PNG',
                    title: data1[1][i],
                    short: 'none',
                    url: data1[3][i]
                }
            }
        }
        data3.push(obj);
    }
    console.log(data3);
    var divData= '';
    if(fn != ''){
        for(let i in data3){
            divData += 
            `
            <div class="row format-row padding-head">
                <div class="search-content col-lg-8 col-md-8 col-sm-8 col-8">
                    <div class="box-content flex-content col-lg-8 col-md-8 col-sm-8 col-8">
                        <img src="${data3[i].source}" alt="" class="col-lg-2 col-md-2 col-sm-2 col-2 size-image">
                        <a href="${data3[i].url}" class="text col-lg-10 col-md-10 col-sm-10 col-10">${data3[i].title}
                        <br>${data3[i].short} </a>
                    </div>
                </div>
            </div>
            `
        }
        document.getElementById('content').innerHTML = divData;
    }
    else{
        divData= '';
        data3 = [];
        document.getElementById('content').innerHTML = '';
    }
}

let getInput = document.getElementById('form1');
getInput.addEventListener('input', () => {
    let fn = getInput.value;
    getData1('https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=10&format=json&search=', 'https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageprops|pageimages&format=json&titles=', fn);
})

