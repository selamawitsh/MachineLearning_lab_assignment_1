from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

# Load models and preprocessor
dt_model = joblib.load("decision_tree_model.pkl")
log_model = joblib.load("logistic_regression_model.pkl")
preprocessor = joblib.load("preprocessor.pkl")

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Fraud Detection API")



origins = ["*"]  

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"],    
)


class Transaction(BaseModel):
    step: int
    type: str
    amount: float
    oldbalanceOrg: float
    newbalanceOrig: float
    oldbalanceDest: float
    newbalanceDest: float
    isFlaggedFraud: float

@app.get("/")
def home():
    return {"message": "Fraud Detection API is running"}

def prepare_input(data: Transaction):
    """
    Convert input data to pandas DataFrame with proper column names
    for the preprocessor.
    """
    input_df = pd.DataFrame([{
        "step": data.step,
        "type": data.type,
        "amount": data.amount,
        "oldbalanceOrg": data.oldbalanceOrg,
        "newbalanceOrig": data.newbalanceOrig,
        "oldbalanceDest": data.oldbalanceDest,
        "newbalanceDest": data.newbalanceDest,
        "isFlaggedFraud": data.isFlaggedFraud
    }])
    return input_df

@app.post("/predict-decision-tree")
def predict_dt(data: Transaction):
    input_df = prepare_input(data)
    processed_data = preprocessor.transform(input_df)
    prediction = dt_model.predict(processed_data)
    return {"fraud_prediction": int(prediction[0])}

@app.post("/predict-logistic")
def predict_log(data: Transaction):
    input_df = prepare_input(data)
    processed_data = preprocessor.transform(input_df)
    prediction = log_model.predict(processed_data)
    return {"fraud_prediction": int(prediction[0])}
