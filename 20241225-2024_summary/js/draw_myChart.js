let chart, data, json

json = {"columns":["met","co2","10","20","30","40","50","60","70","80","90","100"],"index":["io","chem","met"],"data":[[37.213,50.177,60.01,75.223,84.9,97.163,109.711,119.068,128.761,137.101,152.778,157.323],[0.0,73.417,91.484,163.981,229.392,295.494,360.477,413.528,477.477,539.827,622.733,670.474],[171.121,171.121,171.121,171.121,171.121,171.121,171.121,171.121,171.121,171.121,171.121,171.121]]}

Chart.defaults.color = '#000';
Chart.defaults.font.size = 30;
Chart.defaults.font.family = "SimHei"

data = parse_pandas_split_data(json);
show_data(data);

function show_data(data) {
    let cmap = chroma.scale("Blues");
    const ctx = document.getElementById('myChart');
    const config = {
        type: "bar",
        data: {
            labels: data.map(row => row.label),
            datasets: [
                {
                    label: "met run",
                    data: data.map(row => row.met),
                    backgroundColor: cmap(0.9).hex(),
                    borderColor: "black",
                    borderWidth: 1.5,
                    hoverBorderColor: "black",
                    hoverBorderWidth: 3,
                },
                {
                    label: "chem run",
                    data: data.map(row => row.chem),
                    backgroundColor: cmap(0.7).hex(),
                    borderColor: "black",
                    borderWidth: 1.5,
                    hoverBorderColor: "black",
                    hoverBorderWidth: 3,
                },
                {
                    label: "io",
                    data: data.map(row => row.io),
                    backgroundColor: cmap(0.5).hex(),
                    borderColor: "black",
                    borderWidth: 1.5,
                    hoverBorderColor: "black",
                    hoverBorderWidth: 3,
                },
            ]
        },
        options: {
            responsive: true,
            aspectRatio: 1.33,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
            scales: {
                y: {
                    stacked: true,
                    grid: {display: true},
                    ticks: {
                        color: "black",
                        callback: value => `${value} s`
                    }
                },
                x: {
                    stacked: true,
                    grid: {display: false},
                    ticks: {color: "black"}
                },
            }
        },
    };
    chart = new Chart(ctx, config);
}

function parse_pandas_split_data(input) {
    let labels = input["columns"];
    let dataset_labels = input["index"];
    let data_raw = input["data"];
    let n_label = labels.length;
    let n_dataset_label = dataset_labels.length;
    let data = [];
    for (let i = 0; i < n_label; i++) {
        let data_temp = {};
        data_temp["label"] = labels[i];
        for (let j = 0; j < n_dataset_label; j++) {
            data_temp[dataset_labels[j]] = data_raw[j][i];
        }
        data.push(data_temp);
    }
    return data;
}