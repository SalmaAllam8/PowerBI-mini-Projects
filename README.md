# PowerBI-mini-Projects


The super market project 
<img width="997" height="707" alt="image" src="https://github.com/user-attachments/assets/bb46efc3-0848-4f9b-80b7-e0ac20ce7b1c" />

I made this simple Power BI project using a clean and simple Kaggle dataset, primarily to practice the skills I've learned in Power BI.
This visual helps us analyze the performance of each product line throughout the year. This insight will aid us in making decisions regarding inventory management. We also have the average sales for each product during the day (which is optional) and the gross sales per city to understand which city is selling the product the most. Furthermore, we can see the total gross income, average unit price, and average rating for each product, which shows us which products have the highest performance and are most liked by customers.
As for the customer-related insights, we can see which gender purchases the product the most (represented by the pink and blue circle around the image, in case you missed it). We also track the customer type—whether they are 'Normal' or 'Member' customers—and their preferred payment method. This data allows us to learn more about our customer base and supports us in making strategic decisions in marketing.



live project :   https://app.powerbi.com/groups/me/reports/8de3b15c-2d88-4dcf-893e-35269a800ed7/e537cb12a33314cd0a9d?experience=power-bi 
## Project 2

# Walmart Sales prediction 

<img width="1077" height="567" alt="image" src="https://github.com/user-attachments/assets/755e44cd-c201-42d4-83f5-ad6f651a38f2" />
Using a Random Forest Regressor, I developed a sales forecasting model for 2012 based on historical data from 2010 and 2011. To account for model uncertainty, I implemented a dynamic prediction interval in Power BI. By utilizing DAX measures and a user-controlled slicer, I created an upper and lower boundary that adjusts based on forecasted variance. The visualization confirms high model reliability, as actual sales consistently track within the predicted bounds, demonstrating the model's ability to capture complex retail seasonality. 
I used DAX to architect a custom Date Hierarchy,
Dax code used:
Forcast - lowerlimit = (SUM('sales_forecast_2012'[Predicted_Sales]))*(1-[Target range Value])
Forcast - Upperlimit = (SUM('sales_forecast_2012'[Predicted_Sales]))*(1+ [Target range Value])
Target range = GENERATESERIES(0, 1, 0.05)
Quarter = "Q" & FORMAT('sales_forecast_2012'[Date], "Q")
Month = FORMAT(sales_forecast_2012[Date], "MMMM")
Day = FORMAT('sales_forecast_2012'[Date], "DD MMMM")


live project : https://app.powerbi.com/groups/me/reports/b71a0674-1a85-4929-8000-099ac7cc1053/244045120b16176d301c?experience=power-bi 
## project 3
# Calender Heatmap 

<img width="847" height="395" alt="image" src="https://github.com/user-attachments/assets/88a5bd89-edcf-4e86-85dd-ce7c6a5bfa82" />

used the calendar heatmap made by nathansmithbi 
data set from https://github.com/datasets/covid-19 
filtered the data to include only Egypt


live project : https://app.powerbi.com/groups/me/reports/58aa18d9-42ef-4929-a8df-8cd5eb004dd8/4cf96c2cba9823518744?experience=power-bi
please select from year 2020-2022 
