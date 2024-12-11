# Functions for loading the csv file, preprocessing the data and predicting the CO2 value

import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler

MODEL_PATHS = {
    "gru": "./models/model_gru.keras",
    "lstm": "./models/model_lstm.keras",
    "bilstm": "./models/model_bi.keras",
    "cnn_lstm": "./models/model_cnn.keras",
    "deeplstm": "./models/model_deep.keras",
}

CSV_FILE = './static/data/real_time_co2_data.csv'

def load_data(csv_file):
    df = pd.read_csv(csv_file)
    
    if 'datetime' in df.columns:
        df['datetime'] = pd.to_datetime(df['datetime'])
        df.sort_values('datetime', inplace=True)
    
    feature_columns = [col for col in df.columns if col != 'datetime' and col != 'CO2']
    X = df[feature_columns].values
    y = df['CO2'].values if 'CO2' in df.columns else None
    return X, y

def preprocess_data(X, seq_length):
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)
    print(f"Shape after scaling: {X_scaled.shape}")

    # Convert to sequences
    def create_sequences(data, seq_len):
        sequences = []
        for i in range(len(data) - seq_len + 1):
            sequences.append(data[i:i + seq_len])
        return np.array(sequences)

    X_seq = create_sequences(X_scaled, seq_length)
    print(f"Shape after sequence creation: {X_seq.shape}")

    return X_seq, scaler


def predict(model_name, X):
    if model_name not in MODEL_PATHS:
        raise ValueError(f"Model '{model_name}' not found.")
    
    model = load_model(MODEL_PATHS[model_name])
    predictions = model.predict(X)
    return predictions



