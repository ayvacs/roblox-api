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

// for testing
var doClasses = true
var doEnums = false

if (doClasses) {
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

            // d1 is the colon or period before the name and d2 is the parameters after it
            var mt = Member.MemberType;
            if (mt == "Function") {
                type = Member.ReturnType.Name;
                d1 = ":";
            } else if (mt == "Event") {
                type = "-donotshow";
                d1 = ".";
            } else if (mt == "Callback") {
                type = "Callback";
                d1 = ".";
            } else {
                type = Member.ValueType.Name;
                d1 = ".";
            };
            d2 = "";

            // add parameters of functions and events
            if (mt == "Function" || mt == "Event") {
                if (Member.Parameters) {
                    for (let i in Member.Parameters) {
                        if (i+1 < Member.Parameters.length) {
                            comma = ",";
                        } else {
                            comma = "";
                        };

                        var param = Member.Parameters[i];

                        var d = "decorative typeName";
                        if (Member.Tags) {
                            if (Object.values(Member.Tags).includes("Deprecated") || Object.values(Member.Tags).includes("Hidden")) {
                                d = "typeName";
                            };
                        };
                        d2 += ` <span class="${d}">${param.Type.Name}</span> ${param.Name}${comma}`;
                    };

                    d2 = `(${d2} )`;
                };
            }

            if (type != "-donotshow") {
                type = `<span class="Type">${type}&nbsp;</span>`;
            } else {
                type = "";
            };


            // add tags
            tags = ""
            specialClass = ""
            dClass = "decorative";
            if (Member.Tags) {
                for (let _ in Member.Tags) {
                    var tag = Member.Tags[_];
                    // double-space the first tag
                    if (_ == 0) { pre = "&nbsp;" } else { pre = "" };
                    tags += `${pre}&nbsp;<span class="Tag">${tag}</span>&nbsp;`;

                    if (tag == "Deprecated" || tag == "Hidden") {
                        specialClass = "hidden";
                        dClass = "bold";
                        d2 = d2.replace("decorative", "");
                    };
                };
            };

            strTS += `<span class="${Member.MemberType} indent ${specialClass}">${type}<span class="Name">${v.Name}<span class="${dClass}">${d1}</span>${Member.Name}${d2} ${tags}</span></span>`;
        };
    };

    // add to document
    document.body.innerHTML += `<div class="Class">${strTS}</div>`;
};
};

if (doEnums) {
for (let i in Enums) {
    v = Enums[i];
    console.log(v)

    // init
    var strTS = `<span class="name">${v.Name}</span>`;

    // add to document
    document.body.innerHTML += `<div class="Enum">${strTS}</div>`;
};
};