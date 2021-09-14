import * as d3 from 'd3'
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ArrayVis from "../ArrayVis";
import MapArray from '../Demo/map';
import { CgPlayButtonO, CgPlayPauseO } from 'react-icons/cg';

import './style.scss';


const SvgComponent: FC<any> = (props): JSX.Element => {

  const svgRoot = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  let started = false;
  let mapDemo = null;

  const onPauseClick = useCallback(() => {
    console.log('You clicked Pasue', mapDemo);
    mapDemo.pause();
    setIsPlaying(false);
  }, [mapDemo]);

  const onPlayClick = useCallback(() => {
    console.log('You clicked Play', mapDemo);
    !started ? mapDemo.play() : mapDemo.resume();
    setIsPlaying(true);
    started = true;
  }, [mapDemo]);

  const pushTest = () => {
    const data = ['stark','lannister','targeryen']
    const svg = d3.select(svgRoot.current)
        .append('svg')
        .attr('height',100)
        .attr('width',900);
    const a = new ArrayVis(data, svg, {fontsize:23, speed:250});
    setTimeout(function(){
      a.push("baratheon");
      setTimeout(function(){
        a.push("tyrell",2);
        setTimeout(function(){
          svg.remove();
          pushTest();
        },3500)
      },2000)
    },2000);
  };

  const mapTest = () => {
    const data = [1, 2, 3, 4, 5, 6, 7];
    const demo = new MapArray(data, svgRoot.current);

    // setMapDemo(demo);
    return demo;

  };

  useEffect(() => {

    if (svgRoot.current) {
      // const data = ['stark','lannister','targeryen']
      // const svg = d3.select(svgRoot.current)
      //   .append('svg')
      //   .attr('height',100)
      //   .attr('width',900);
      // var a = new ArrayVis(data, svg, {fontsize:45, speed:250});

     const instance = mapTest();
     mapDemo = instance;
    }
  }, []);


  return (
    <>
      {isPlaying ? 
          <CgPlayPauseO color="grey" size="2em" className="button" onClick={() => onPauseClick()} /> :
          <CgPlayButtonO color="red" size="2em" className="button" onClick={() => onPlayClick()} />}
      <div ref={svgRoot}></div>
    </>
  );
}
  
  export default SvgComponent;