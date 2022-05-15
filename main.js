function get(url){
    return JSON.parse($.ajax({
        async: false,
        url: url
    }).responseText);
};

var data = get("https://raw.githubusercontent.com/MaximumADHD/Roblox-Client-Tracker/roblox/API-Dump.json");
var vers = get("https://api.github.com/repos/MaximumADHD/Roblox-Client-Tracker/commits")[0].commit.message;

document.getElementById("v").innerHTML = vers;

var Classes = data.Classes;
var Enums = data.Enums;
var Version = data.Version;

for (let i in Classes) {
    var v = Classes[i];
    console.log(v);

    // init
    var strTS = `<span class="name">${v.Name}</span>`;

    // add Superclass
    if (v.Superclass) {
        strTS += `<span class="superclass"><span class="decorative">:</span> ${v.Superclass}</span>`;
    };

    // add tags
    if (v.Tags) {
        for (let _ in v.Tags) {
            // double-space the first tag
            if (_ == 0) { pre = "&nbsp;" } else { pre = "" };
            strTS += `${pre}&nbsp;<span class="Tag">${v.Tags[_]}</span>&nbsp;`;
        };
    };

    strTS += "<br>"

    // add children
    if (v.Members) {
        for (let _ in v.Members) {
            var Member = v.Members[_];

            // get type name, this is rlly messy but oh well
            var mt = Member.MemberType;
            if (mt == "Function") {
                type = Member.ReturnType.Name;
                d = ":";
            } else if (mt == "Event") {
                type = "-donotshow";
                d = ".";
            } else if (mt == "Callback") {
                type = "Callback";
                d = ".";
            } else {
                type = Member.ValueType.Name;
                d = ".";
            };

            if (type != "-donotshow") {
                type = `<span class="Type">${type}&nbsp;</span>`;
            } else {
                type = ``;
            };


            // add tags
            tags = ""
            if (Member.Tags) {
                for (let _ in Member.Tags) {
                    // double-space the first tag
                    if (_ == 0) { pre = "&nbsp;" } else { pre = "" };
                    tags += `${pre}&nbsp;<span class="Tag">${Member.Tags[_]}</span>&nbsp;`;
                };
            };

            strTS += `<span class="${Member.MemberType} indent">${type}<span class="Name">${v.Name}<span class="decorative">${d}</span>${Member.Name} ${tags}</span></span>`;
        };
    };

    // add to document
    document.body.innerHTML += `<div class="Class">` + strTS + `</div>`;
}