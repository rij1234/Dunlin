"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState, Route } from 'react';
import { invoke } from '@tauri-apps/api/tauri'

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
        return day.date === date.getTime();
      }
    )
    if(found_day === undefined) found_day = {date: date, pointsCompleted: 0};

    let day = (new Date(found_day.date)).getDay();
    dataInWeeklyChart.push(found_day.pointsCompleted);
    return (weekday[day]);

    }
  );

  console.log(thisWeeksDates)
  console.log(dataInWeeklyChart)

  const average = array => array.reduce((a, b) => a + b) / array.length;
  let weeklyAverage = average(dataInWeeklyChart);

  let chartData = [];

  for(let i = 0; i < thisWeeksDates.length; i++) {
    chartData.push({day: thisWeeksDates[i], points: dataInWeeklyChart[i]})
  }

  console.log(chartData)


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

    </main>
  );
}
