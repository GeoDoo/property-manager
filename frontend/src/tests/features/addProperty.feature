Feature: Add Property
  As a user
  I want to add a new property
  So that I can list it in the property manager

  Scenario: Successfully add a new property
    Given I am on the property list page
    When I click the "Add Property" button
    Then I should be redirected to the add property form
    When I fill in the following property details:
      | Field       | Value              |
      | Street      | 123 Test Street    |
      | City        | Test City          |
      | State       | Test State         |
      | Zip         | 12345             |
      | Price       | 500000            |
      | Bedrooms    | 3                 |
      | Type        | HOUSE             |
    And I click the "Save" button
    Then I should see a success message "Property added successfully"
    And I should be redirected to the property list page
    And I should see the new property in the list

  Scenario: Attempt to add a property with invalid data
    Given I am on the property list page
    When I click the "Add Property" button
    Then I should be redirected to the add property form
    When I fill in the following property details:
      | Field       | Value              |
      | Street      |                    |
      | City        |                    |
      | Price       | -1000             |
    And I click the "Save" button
    Then I should see validation errors:
      | Field       | Error                           |
      | Street      | Street is required              |
      | City        | City is required                |
      | Price       | Price must be greater than 0    | 