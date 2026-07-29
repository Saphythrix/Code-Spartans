"""
EmotionSync AI - Model Training & Fine-Tuning Pipeline
Dataset: Kaggle FER-2013 / AffectNet Facial Expression Datasets
Framework: PyTorch + HuggingFace Transformers & Datasets
"""

import os
import sys
import logging
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import transforms, datasets

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("train_emotion")

EMOTIONS = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"]

class EmotionResNet(nn.Module):
    def __init__(self, num_classes=len(EMOTIONS)):
        super(EmotionResNet, self).__init__()
        import torchvision.models as models
        self.resnet = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
        num_ftrs = self.resnet.fc.in_features
        self.resnet.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(num_ftrs, 256),
            nn.ReLU(),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        return self.resnet(x)

def train_kaggle_model(data_dir="./dataset", epochs=5, batch_size=32, lr=0.001):
    logger.info("Initializing Kaggle FER-2013 Model Training Pipeline...")
    
    if not os.path.exists(data_dir):
        logger.warning(f"Data directory '{data_dir}' not found.")
        logger.info("Instructions to train on Kaggle FER-2013:")
        logger.info("1. Download FER-2013 from Kaggle: https://www.kaggle.com/datasets/msambare/fer2013")
        logger.info("2. Extract dataset folder into ./dataset/train and ./dataset/test")
        logger.info("3. Re-run this script to execute GPU fine-tuning.")
        return

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info(f"Training on device: {device}")

    # Image Transforms
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'test': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    image_datasets = {x: datasets.ImageFolder(os.path.join(data_dir, x), data_transforms[x]) for x in ['train', 'test']}
    dataloaders = {x: DataLoader(image_datasets[x], batch_size=batch_size, shuffle=True, num_workers=2) for x in ['train', 'test']}

    model = EmotionResNet(num_classes=len(EMOTIONS)).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)

    for epoch in range(epochs):
        logger.info(f"Epoch {epoch+1}/{epochs}")
        for phase in ['train', 'test']:
            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            for inputs, labels in dataloaders[phase]:
                inputs, labels = inputs.to(device), labels.to(device)
                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / len(image_datasets[phase])
            epoch_acc = running_corrects.double() / len(image_datasets[phase])

            logger.info(f"{phase.capitalize()} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}")

    os.makedirs("./models", exist_ok=True)
    save_path = "./models/emotion_sync_resnet.pth"
    torch.save(model.state_dict(), save_path)
    logger.info(f"Successfully trained & saved emotion model weights to {save_path}!")

if __name__ == "__main__":
    train_kaggle_model()
