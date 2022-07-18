import { Component, OnInit } from '@angular/core';
// @ts-ignore
import * as d3 from 'd3';
import {StatsService} from "../services/stats.service";

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.css'],
  providers: [StatsService]
})
export class StatsPageComponent implements OnInit {

  constructor(private statsService: StatsService) { }

  // top seller list
  public topSellers: any[] = []

  ngOnInit(): void {
    // Get sales by day from backend and init d3 graph
    this.statsService.getSalesByDay().subscribe((results: any) => {
      const data = results.map((result: any) => {
        return {
          total_sales: result.total_sales,
          date: result._id.created_date
        }
      }).sort((a: any, b: any)=>{
        return a.date > b.date
      })
      this.initializeSalesGraph(data,
        results.map((result: any) => result.total_sales)
          .reduce((old: any, next: any) => old > next ? old : next))
    })
    this.statsService.getTopSellersTable().subscribe((results: any) => {
      this.topSellers = results.map((result: any) => {
          return {
            title: result.product_data[0].title,
            brand: result.product_data[0].brand,
            category: result.product_data[0].category,
            sub_category: result.product_data[0].sub_category,
            sales: result.sales,
            _id: result._id
          }
        }
      )

    })
  }

  initializeSalesGraph(data: any, max_sales: number) {
    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 30, bottom: 70, left: 60},
      width = 580 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
    const svg = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    data.sort(function(a: any, b: any) {
      return d3.ascending(a.date, b.date)
    })
    const x = d3.scaleBand()
      .range([ 0, width ])
      // display date on X
      .domain(data.map((d: any) => d.date))
      .padding(0.2);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

// Add Y axis
    const y = d3.scaleLinear()
      // room for all bars
      .domain([0, max_sales * 1.25])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

// Bars
    svg.selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", (d: any) => x(d.date))
      .attr("y", (d: any) => y(d.total_sales))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => height - y(d.total_sales))
      .attr("fill", "#69b3a2")
  }
}
