let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    let selectedTeamStats;
    let color;
    let winsLosses = [];
    let direRadiant = [];

    if (this.readyState === 4 && this.status === 200) {
        let teamStats = JSON.parse(this.responseText);
        let select = document.getElementById("team-selector");
        for (let i = 0; i < teamStats.data.length; i++) {
            let option = document.createElement("option");
            option.text = teamStats.data[i].team.name;
            if (teamStats.data[i].team.name === "Team Liquid") {
                option.selected = true;
            }
            select.add(option);
        }

        d3.select("#team-score")
            .append("svg")
            .attr("width", 300)
            .attr("height", 300)
            .attr("id", "pie-wins-losses")
            .style("border", "1px solid black")
            .style("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19");

        // let winsLossesText = d3.select("#pie-wins-losses")
        //     .append("text")
        //     .attr("transform", "translate(" + teamScore.attr("width") / 2 + ", " + "30)")
        //     .attr("text-anchor", "middle")
        //     .attr("font-family", "courier")
        //     .attr("class", "graph-title")
        //     .text("Wins vs Losses");

        d3.select("#team-sides")
            .append("svg")
            .attr("width", 300)
            .attr("height", 300)
            .attr("id", "pie-dire-radiant")
            .style("border", "1px solid black")
            .style("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19");

        // let direRadiantText = d3.select("#pie-dire-radiant")
        //     .append("text")
        //     .attr("transform", "translate(" + teamSide.attr("width") / 2 + ", " + "30)")
        //     .attr("text-anchor", "middle")
        //     .attr("font-family", "courier")
        //     .attr("class", "graph-title")
        //     .text("As Radiant / As Dire");

        displayTeamName();
        drawWinLossChart();
        drawDireRadiantChart();

        select.onchange = function () {
            displayTeamName();
            drawWinLossChart();
            drawDireRadiantChart();
        };

        function displayTeamName() {
            selectedTeamStats = teamStats.data.find(entry => entry.team.name === select.options[select.selectedIndex].text);
            let teamName = selectedTeamStats.team.name;
            getData();
            document.getElementById("team-name").innerHTML = teamName;
        }

        function getData() {
            let wins = selectedTeamStats.wins;
            let losses = selectedTeamStats.losses;
            let dire = selectedTeamStats.gamesDire;
            let radiant = selectedTeamStats.gamesRadiant;
            winsLosses = [{"label":"Wins", "value":wins},{"label":"Losses", "value":losses}];
            direRadiant =[{"label":"Dire", "value":dire},{"label":"Radiant", "value":radiant}];
        }

        function drawWinLossChart() {

            let svgWinLoss = d3.select("#pie-wins-losses"),
                width = svgWinLoss.attr("width"),
                height = svgWinLoss.attr("height"),
                radius = ((Math.min(width, height) / 2) - 10),
                g = svgWinLoss.append("g")
                    .attr("transform", "translate(" + width / 2 + ", " + (height / 2) + ")")
                    .data(winsLosses);

            color = d3.scale.category10();

            let pie = d3.layout.pie()
                .sort(null)
                .value(function (d) {
                    return d.value;
                });

            let arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(radius);

            let arcs = g.selectAll("arc")
                .data(pie(winsLosses))
                .enter()
                .append("g")
                .attr("class", "arc");

            arcs.append("path")
                .style("fill", function (d, i) {
                    return color(i);
                })
                .attr("d", arc);

            let scoreLabels = arcs.selectAll("text")
                .data(pie(winsLosses))
                .enter()
                .append("text");

            scoreLabels.attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("text-anchor", "middle")
            .attr("class", "graph-shadow")
            .text(function (d) {
                if (d.data.value > 1) {
                    return d.data.value + "\n" + d.data.label;
                } else if (d.data.value > 0) {
                    if (d.data.label === "Wins") {
                        return "1 Win";
                    } else {
                        return "1 Loss";
                    }
                }
            });
        }

        function drawDireRadiantChart() {


            let svgDireRadiant = d3.select("#pie-dire-radiant"),
                width = svgDireRadiant.attr("width"),
                height = svgDireRadiant.attr("height"),
                radius = ((Math.min(width, height) / 2) - 10),
                g = svgDireRadiant.append("g")
                    .attr("transform", "translate(" + width / 2 + ", " + (height / 2) + ")")
                    .data(direRadiant);

            color = d3.scale.category10();

            let pie = d3.layout.pie()
                .sort(null)
                .value(function (d) {
                    return d.value;
                });

            let arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(radius);

            let arcs = g.selectAll("arc")
                .data(pie(direRadiant))
                .enter()
                .append("g")
                .attr("class", "arc");

            arcs.append("path")
                .style("fill", function (d, i) {
                    return color(i);
                })
                .attr("stroke", "black")
                .attr("stroke-width", "2px")
                .attr("d", arc);

            let sideLabels = arcs.selectAll("text")
                .data(pie(direRadiant))
                .enter()
                .append("text");

            sideLabels.attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("text-anchor", "middle")
                .attr("class", "graph-shadow")
                .text(function (d) {
                    return d.data.value + "\n" + d.data.label;});
        }
    }
};
//xmlhttp.open("GET", "https://cors-anywhere.herokuapp.com/http://datdota.com/api/teams/performances?teams=2163&tier=1&tier=2&valve-event=does-not-matter&threshold=1&patch=7.22&after=20%2F08%2F2019&before=25%2F08%2F2019&duration=0%3B200&duration-value-from=0&duration-value-to=200", true);
xmlhttp.open("GET", "../data/teamPerformanceData.json", true);
xmlhttp.send();