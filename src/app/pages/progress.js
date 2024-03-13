"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState, Route } from 'react';
import { invoke } from '@tauri-apps/api/tauri'
import HeatMap from '@uiw/react-heat-map';
import {Tooltip as TooltipUI} from "@nextui-org/react";

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Progress({setPage}) {

  const [greeting, setGreeting] = useState();
  const [days, setDays] = useState([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {invoke("get_days").then(setDays)}, [])

  const datesToGet = [6,5,4,3,2,1,0].map(n =>
    {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(today.getDate() - n);
      // console.log(d.getTime())
      return d;
    }
  )

  const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  let dataInWeeklyChart = [];

  let thisWeeksDates = datesToGet.map(
  date => {
    let found_day = days.find(
      day=>{
        let dd = new Date();
        dd.setDate(day.date.split("/")[0])
        dd.setMonth(day.date.split("/")[1] - 1)
        dd.setFullYear(day.date.split("/")[2])
        dd.setHours(0, 0, 0, 0);
        return dd.getTime() === date.getTime();
      }
    )
    if(found_day === undefined) found_day = {date: date, pointsCompleted: 0};

    let day = (new Date(found_day.date)).getDay();
    dataInWeeklyChart.push(found_day.pointsCompleted);
    return (weekday[day]);

    }
  );

  const average = array => array.reduce((a, b) => a + b) / array.length;
  let weeklyAverage = average(dataInWeeklyChart);

  let chartData = [];

  for(let i = 0; i < thisWeeksDates.length; i++) {
    chartData.push({day: thisWeeksDates[i], points: dataInWeeklyChart[i]})
  }

  console.log(chartData)


  let dataInHeatmap = [];

  dataInHeatmap = days.map(d => {
    return {date: `${d.date.split("/")[2]}/${d.date.split("/")[1]}/${d.date.split("/")[0]}`, count: d.pointsCompleted};
  })

  console.log(days)



  return (
    <main className="flex min-h-screen flex-col items-center py-5">
      <div className="space-y-6  mb-5 text-xl py-5"><b>Progress</b></div>

      <div>This Week</div>
      <div>Average Points: {Math.round(weeklyAverage * 100) / 100}</div>

      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <Tooltip />
        <Bar dataKey="points" fill="#8884d8" activeBar={<Rectangle fill="orange" stroke="orange" />} />
      </BarChart>


      <div className="pt-8 pb-2">Year At A Glance</div>
      <div>
        <HeatMap
          width={720}
          value={dataInHeatmap}
          startDate={new Date(`${new Date().getFullYear()}/01/01`)}
          endDate={new Date(`${new Date().getFullYear()}/12/31`)}
          rectRender={(props, data) => {
            return (
              <TooltipUI
                delay={0}
                closeDelay={0}
                content={
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">{new Date(data.date).toLocaleDateString('en-us', {year:"numeric", month:"short", day:"numeric"})}</div>
                    <div className="text-tiny">Points: {data.count !== undefined ? data.count : 0}</div>
                  </div>
                }>
                <rect {...props} />
              </TooltipUI>
            )
          }}
        />
        </div>



    </main>
  );
}
