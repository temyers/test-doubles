# test-doubles

Explore different types of test doubles and the impact on testing.

**setup**:
```
aws cloudformation create-stack --stack-name test-double-db --template-body file://infrastructure/template.yml
```

**count items**:
```aws dynamodb scan --table-name Accounts --select COUNT```

**tear down**:
```
aws cloudformation delete-stack --stack-name test-double-db
```