import React, { useState } from "react";

function App() {
  const [cuttingDistance, setCuttingDistance] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const svgContent = e.target.result;
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");

      let totalDistance = 0;

      const group = svgDoc.querySelector("g");
      console.log("Processing SVG Group:", group);

      // Handle path elements using getTotalLength
      const paths = group.querySelectorAll("path");
      paths.forEach((path) => {
        const length = path.getTotalLength();
        console.log("Path Element:", path);
        console.log("Path Total Length:", length);
        totalDistance += length;
      });

      // Handle rectangle elements manually
      const rects = group.querySelectorAll("rect");
      rects.forEach((rect) => {
        const width = parseFloat(rect.getAttribute("width"));
        const height = parseFloat(rect.getAttribute("height"));
        const rx = parseFloat(rect.getAttribute("rx")) || 0;
        const ry = parseFloat(rect.getAttribute("ry")) || 0;

        let perimeter;

        if (rx > 0 && ry > 0) {
          // Handle rounded rectangles
          const circlePerimeter = 2 * Math.PI * rx;
          const rectPerimeter = 2 * (width - 2 * rx) + 2 * (height - 2 * ry);
          perimeter = circlePerimeter + rectPerimeter;
          console.log(
            "Rounded Rectangle/Circle Equivalent Perimeter:",
            perimeter
          );
        } else {
          // Handle regular rectangles
          perimeter = 2 * (width + height);
          console.log("Rectangle Perimeter:", perimeter);
        }

        totalDistance += perimeter;
      });

      // Handle circle elements manually
      const circles = group.querySelectorAll("circle");
      circles.forEach((circle) => {
        const radius = parseFloat(circle.getAttribute("r"));
        const circumference = 2 * Math.PI * radius;
        console.log("Circle Element:", circle);
        console.log("Circle Radius:", radius);
        console.log("Circle Circumference:", circumference);
        totalDistance += circumference;
      });

      console.log("Final Total Distance:", totalDistance);
      setCuttingDistance(totalDistance);
    };

    reader.readAsText(file);
  };

  return (
    <div className="App">
      <h1>SVG Cutting Distance Calculator</h1>
      <input type="file" accept=".svg" onChange={handleFileUpload} />
      <p>Cutting Distance: {cuttingDistance.toFixed(2)} units</p>
    </div>
  );
}

export default App;
