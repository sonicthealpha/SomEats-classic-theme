import { Button, Container, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as api from "../../utils/api";
import { useTranslation } from "react-i18next";
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";
import NorthEastIcon from "@mui/icons-material/NorthEast";

const Faq = () => {
  const cities = useSelector((state) => state.Cities)?.cities;
  const demoMOde = process.env.REACT_APP_DEMO_MODE || "true";

  const [faqs, setFaqs] = useState();
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const { t } = useTranslation();

  useEffect(() => {
    api.get_faqs().then((response) => {
      if (!response.error) {
        setFaqs(response.data);
      }
    });
    // eslint-disable-next-line
  }, []);

  const changeCity = (city) => {
    console.log("change city : ", city);
    localStorage.setItem("city", demoMOde === "true" ? 1 : city.id);
    localStorage.setItem("current_city", demoMOde === "bhuj" ? 1 : city.name);
    window.location.reload();
  };
  return (
    <Container>
      <div className="title-wrapper" data-aos="fade-up">
        <Typography variant="h4" component="h4" className="bold">
          <Highlighter
            highlightClassName="highlight"
            searchWords={["Queries?"]}
            autoEscape={true}
            textToHighlight={t("queries")}
          />
        </Typography>
        <Typography weight="light">{t("any_queries")}</Typography>
      </div>
      <div className="accordian">
        <Accordion className="mb20 accordian-wrapper">
          <AccordionSummary
            expandIcon={<NorthEastIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography component="h5" variant="h6">
              {t("cities_we_deliver")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={0}>
              {cities &&
                cities.map((city, index) => {
                  return (
                    <Button
                      color="error"
                      onClick={() => changeCity(city)}
                      key={city.id}
                    >
                      {city.name}
                    </Button>
                  );
                })}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {faqs &&
          faqs.map((faq, index) => {
            const { question, answer } = faq;
            return (
              <Accordion
                className="mb20 accordian-wrapper"
                key={index}
                expanded={expanded === index}
                onChange={handleAccordionChange(index)}
              >
                <AccordionSummary
                  expandIcon={<NorthEastIcon />}
                  aria-controls={`panel${index}a-content`}
                  id={`panel${index}a-header`}
                >
                  <Typography component="h5" variant="h6">
                    {question}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography>{answer}</Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </div>
    </Container>
  );
};

export default Faq;
