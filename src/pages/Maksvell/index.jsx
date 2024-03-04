import { Fragment, useEffect, useRef, useState } from "react";
import "./style.scss";
import Chart from "react-apexcharts";
import { Button, Form, InputNumber, Radio, Space } from "antd";
const Maksvell = () => {
  const canvasRef = useRef(null);
  const [speed, setSpeed] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [inputSpeed, setInputSpeed] = useState(0);
  const [massa, setMassa] = useState(0);
  const [chartBols, setChartBols] = useState([]);
  const [chartTemperature, setChartTemperature] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 600;
    let innerWidth = 536;
    let innerHeight = 530;
    let isAnimating = true;
    let animationId;

    function circle(x, y, x1, y1, dx, dy, dx1, dy1, radius) {
      this.x = x;
      this.y = y;
      this.x1 = x1;
      this.y1 = y1;

      this.dx = dx;
      this.dy = dy;

      this.dx1 = dx1;
      this.dy1 = dy1;

      this.radius = radius;

      this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffc700";
        ctx.fill();
        ctx.stroke();
      };

      this.draw1 = function () {
        ctx.beginPath();
        ctx.arc(this.x1, this.y1, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
      };

      this.update = function () {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }
        if (this.x1 + 4 > innerWidth || this.x1 - 4 < 0) {
          this.dx1 = -this.dx1;
        }
        if (this.y1 + 4 > innerHeight || this.y1 - 4 < 0) {
          this.dy1 = -this.dy1;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.x1 += this.dx1;
        this.y1 += this.dy1;

        if (!isAnimating) {
          cancelAnimationFrame(animationId);
          return;
        }

        this.draw();
        this.draw1();
      };
    }

    let circleArray = [];

    for (let i = 0; i < 17; i++) {
      let radius = 6;
      let x = Math.random() * (innerWidth - radius * 2) + radius;
      let y = Math.random() * (innerHeight - radius * 2) + radius;
      let x1 = Math.random() * (innerWidth - radius * 2) + radius;
      let y1 = Math.random() * (innerWidth - radius * 2) + radius;
      let dx = ((Math.random() - 0.5) * speed) / 30;
      let dy = ((Math.random() - 0.5) * speed) / 30;
      let dx1 = ((Math.random() - 0.5) * speed) / 30;
      let dy1 = ((Math.random() - 0.5) * speed) / 30;
      circleArray.push(new circle(x, y, x1, y1, dx, dy, dx1, dy1, radius));
    }
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
      }
    }
    animate();
  }, [speed]);

  const onFinish = ({ speed, temperature, substance }) => {
    setSpeed(speed);
    setInputSpeed(speed);
    setTemperature(temperature);
    setMassa(substance);

    // Update chartTemperature array with the new temperature value
    setChartTemperature((prevTemperature) => [...prevTemperature, temperature]);
  };
  const handleSpeed = (e) => {
    // setSpeed(inputSpeed);
    // setTemperature(inputTemperature);
    e.preventDefault();
  };
  const stopSpeed = (e) => {
    setSpeed(0);
    e.preventDefault();
  };
  const k = 1.38; // Boltzmann constant

  let normalizationConstant = massa / (2 * Math.PI * k * temperature) ** 1.5;

  let exponentialTerm = Math.pow(
    2.71,
    -(massa * Math.pow(speed, 2)) / (2 * Math.PI * k * temperature)
  );

  let probabilityDensity =
    4 * Math.PI * normalizationConstant * Math.pow(speed, 2) * exponentialTerm;

  // Convert the rounded string back to a number if needed

  // Square speed
  let squareSpeed = Math.sqrt((3 * k * temperature) / massa);
  let meanSpeed = Math.sqrt((8 * k * temperature) / (massa * Math.PI));
  let probablySpeed = Math.sqrt((2 * k * temperature) / massa);

  if (
    isNaN(
      squareSpeed,
      probabilityDensity,
      meanSpeed,
      normalizationConstant,
      exponentialTerm,
      probabilityDensity
    )
  ) {
    squareSpeed = 0;
    meanSpeed = 0;
    probablySpeed = 0;
    normalizationConstant = 0;
    exponentialTerm = 0;
    probabilityDensity = 0;
  } else {
    squareSpeed = Math.sqrt((3 * k * temperature) / massa);
    meanSpeed = Math.sqrt((8 * k * temperature) / (massa * Math.PI));
    probablySpeed = Math.sqrt((2 * k * temperature) / massa);
    normalizationConstant = massa / (2 * Math.PI * k * temperature) ** 1.5;
    exponentialTerm = Math.exp(
      -(massa * Math.pow(speed, 2)) / (2 * Math.PI * k * temperature)
    );
    probabilityDensity =
      4 *
      Math.PI *
      normalizationConstant *
      Math.pow(speed, 2) *
      exponentialTerm;
  }

  const roundedNumber = Math.round(probabilityDensity * 1000);

  console.log(roundedNumber, "probability density");

  // Probably speed
  // mean speed
  useEffect(() => {
    setChartBols((prevBols) => [...prevBols, roundedNumber]);
    
  }, [roundedNumber]);

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };

  console.log(temperature, "on");

  const radioValue = (e) => {
    setMassa(e.target.value);
  };
  const newChartBols = chartBols.filter((value) => value !== undefined);
  const seriesArray = [];

  seriesArray.push({
    name: '',
    data: [],
  });

  const data = {
    series: [
      {
        name: "",
        // data: newChartBols,
        data: newChartBols,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Maksvel taqsimoti grafigi ",
        align: "left",
      },
      grid: {
        row: {
          colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
        },
      },
      xaxis: {
        categories: chartTemperature,
      },
    },
  };
  console.log(chartTemperature, "chartTemperature");

  return (
    <Fragment>
      <div className="all-content">
        <div>
          <div className="particle-motion">
            <canvas ref={canvasRef} style={{ border: "1px solid #000" }} />
          </div>
          <div className="tools">
            <Form
              name="validate_other"
              {...formItemLayout}
              onFinish={onFinish}
              initialValues={{
                "input-number": 0,
              }}
              style={{ maxWidth: 1000, marginTop: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <Form.Item>
                  <label htmlFor="" className="">
                    T=
                  </label>

                  <Form.Item
                    name="temperature"
                    rules={[
                      { required: true, message: "Temperaturani kiriting!" },
                    ]}
                    noStyle
                  >
                    <InputNumber
                      min={1}
                      max={1000}
                      // onChange={temperatureInputValue}
                    />
                  </Form.Item>
                  <span className="ant-form-text" style={{}}>
                    K
                  </span>
                </Form.Item>
                <Form.Item className="">
                  <label htmlFor="" className="niconne">
                    v=
                  </label>
                  <Form.Item
                    rules={[{ required: true, message: "Tezlikni kiriting!" }]}
                    name="speed"
                    noStyle
                  >
                    <InputNumber
                      min={1}
                      max={1000}
                      // onChange={speedInputValue}
                    />
                  </Form.Item>
                  <span className="ant-form-text" style={{}}>
                    m/s
                  </span>
                </Form.Item>
              </div>

              <Form.Item
                name="substance"
                rules={[{ required: true, message: "Moddani tanlang" }]}
              >
                <Radio.Group>
                  <Radio.Button value="0.002">Vodorod</Radio.Button>
                  <Radio.Button value="0.004">Geliy</Radio.Button>
                  <Radio.Button value="0.020">Neon</Radio.Button>
                  <Radio.Button value="0.028">Azot</Radio.Button>
                  <Radio.Button value="0.032">Kislorod</Radio.Button>
                  <Radio.Button value="0.040">Argon</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                <Space>
                  <Button
                    onClick={() => handleSpeed()}
                    type="primary"
                    htmlType="submit"
                  >
                    Boshlash
                  </Button>
                  <Button
                    onClick={() => stopSpeed()}
                    type="primary"
                    htmlType="submit"
                  >
                    Toxtatish
                  </Button>
                  <Button htmlType="reset">Yangilash</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="graph">
          <div id="chart">
            <Chart
              options={data.options}
              series={data.series}
              type="area"
              height={350}
            />
          </div>
          {/* <div>
            <Line data={data} />
          </div> */}
          <div>
            <div className="square">
              <h6 className="niconne">
                v<sub>kv</sub>={Math.round(squareSpeed)} k/m{" "}
              </h6>
            </div>
            <div className="probably">
              <h6 className="niconne">
                v<sub>eh</sub>={Math.round(probablySpeed)}k/m
              </h6>
            </div>
            <div className="delta">
              <h6 className="niconne">
                <span>△</span>v={Math.round(meanSpeed)} k/m
              </h6>
            </div>
            <h4>Maksvell taqsimoti qiymati: {roundedNumber}</h4>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Maksvell;
