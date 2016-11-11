rm index.zip
zip –r index.zip lambda/*
aws lambda update-function-code --function-name Quotes --zip-file fileb://index.zip
