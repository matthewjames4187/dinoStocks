import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import PortfolioLineChart from '../components/PortfolioLineChart';
import axios from 'axios';
import { userAPI } from '../utilities';

const OverviewPage = () => {
  const [userInfo, setUserInfo] = useState([])
  const [portfolioData, setPortfolioData] = useState([])
  const [dailyAveragePortfolio, setDailyAveragePortfolio] = useState([])
  const [showDaily, setShowDaily] = useState(true)

  const mockStockData = [
    { stock: 'Dino Corp', details: '20 shares @ $50', price: '$1000' },
    { stock: 'Jurassic Ventures', details: '10 shares @ $80', price: '$800' },
    { stock: 'Prehistoric Inc', details: '5 shares @ $120', price: '$600' },
  ];



  const fetchPortfolio = async () => {
    let token = localStorage.getItem("token")
    if (token) {
      try {
        let response = await axios.get(`http://127.0.0.1:8000/api/v1/portfolio/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        })
        setUserInfo(response.data)

        // Group data by date
        const groupedData = response.data.historicals.reduce((result, entry) => {
          const date = entry.time_stamp.split('T')[0];
          if (!result[date]) {
            result[date] = [];
          }
          result[date].push(entry);
          return result;
        }, {});

        // Calculate daily averages
        const dailyAverages = Object.keys(groupedData).map((date) => {
          const entries = groupedData[date];
          const totalPortfolioValue = entries.reduce((sum, entry) => sum + parseFloat(entry.portfolio_value), 0);
          const portfolio_value = (totalPortfolioValue / entries.length).toFixed(2);

          return {
            date,
            portfolio_value
          };
        });




        const transformedData = response.data.historicals.map(({ time_stamp, portfolio_value }) => ({
          date: time_stamp,
          portfolio_value,
        }));
        setPortfolioData(transformedData)
        setDailyAveragePortfolio(dailyAverages)
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    }

  }
  useEffect(() => {
    const fetchData = async () => {
      await fetchPortfolio();
    };

    fetchData();
  }, []);


  const handleToggleChart = () => {
    setShowDaily((prevShowDailyAverage) => !prevShowDailyAverage);
  };


  return (
    <Container fluid>
      <Row className="my-4">
        <Col md={3}>
          <Card className="mb-3">
            <Card.Img variant="top" src="https://via.placeholder.com/150" className="d-none d-md-block" />
            <Card.Body>
              <Card.Title>Total $ Available</Card.Title>
              <Card.Text>{userInfo.money}</Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              {/* Replace with actual links or buttons for account settings */}
              <Card.Text>Edit Profile</Card.Text>
              <Card.Text>Purchase History</Card.Text>
              <Card.Text>View Market</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Portfolio Performance      <Button onClick={handleToggleChart} variant="primary">
                {showDaily ? 'Time Stamp' : 'Daily Average'}
              </Button></Card.Title>

              <div >

                {showDaily ? <PortfolioLineChart data={dailyAveragePortfolio} /> : <PortfolioLineChart data={portfolioData} />}

              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>List of Stocks You Own</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Stock</th>
                    <th>Shares</th>
                    <th>Current Price</th>
                    <th>Purchase Price</th>
                    <th>Change</th>
                    <th>Current Value</th>
                  </tr>
                </thead>
                <tbody>
                  {userInfo.shares && userInfo.shares.map((stock, index) => (
                    <tr key={index}>
                      <td>{stock.dino_name}</td>
                      <td>{stock.shares}</td>
                      <td>{stock.current_price}</td>
                      <td>{stock.price_at_purchase}</td>
                      <td className={(stock.current_price - stock.price_at_purchase).toFixed(2).startsWith('-') ? 'text-danger' : 'text-success'}> {(stock.current_price - stock.price_at_purchase).toFixed(2).startsWith('-') ? '↓' : '↑'}{(stock.current_price - stock.price_at_purchase).toFixed(2)}</td>
                      <td>{(stock.current_price * stock.shares).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OverviewPage;
