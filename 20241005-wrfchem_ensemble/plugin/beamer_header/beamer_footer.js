var section_list = document.getElementsByTagName("section");
var frame_list = [];
var title, author, institude
var short_title="Title", short_author="Author", short_institude="Institude"

for (let i = 0; i < section_list.length; i++) {
    let v = section_list[i];
    if (v.getElementsByTagName("section").length == 0) {
        frame_list.push(v);
    }
}
var n_frame = frame_list.length;
for (let i = 0; i < frame_list.length; i++) {
    let v = frame_list[i];
    let frame = v.getElementsByClassName("frame")[0];
    let parentNode = frame;
    if (! frame) {
        parentNode = v;
    }
    let div = document.createElement("footer");
    div.className = "test";
    div.innerHTML = `
<div style="text-align:left; flex: 0 0 auto;">${short_author}<br><a href='#/0'>${short_title}</a></div>
<div style="flex: 1 0 auto;"></div>
<div style="text-align:right; flex: 0 0 auto;">${short_institude}<br>${i+1} / ${n_frame}</div>;
`;
//     div.style = "flex: 1 1 auto;"
//     parentNode.appendChild(div);
//     let footer = document.createElement("footer");
//     footer.innerHTML = `
// <div style="text-align:left; flex: 0 0 auto;">${short_author}<br><a href='#/0'>${short_title}</a></div>
// <div style="flex: 1 0 auto;"></div>
// <div style="text-align:right; flex: 0 0 auto;">${short_institude}<br>${i+1} / ${n_frame}</div>
// `
//     parentNode.appendChild(footer);
}