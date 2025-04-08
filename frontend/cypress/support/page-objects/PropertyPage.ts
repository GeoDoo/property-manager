/**
 * Page Object class for Property-related pages and operations
 */
class PropertyPage {
  // Selectors for Property Listing page
  propertyCard = '[data-testid="property-card"]';
  propertyAddress = '[data-testid="property-address"]';
  propertyPrice = '[data-testid="property-price"]';
  editButton = '[data-testid="edit-property-button"]';
  deleteButton = '[data-testid="delete-property-button"]';
  confirmDeleteButton = '[data-testid="confirm-delete-button"]';
  addPropertyButton = '[data-testid="add-property-button"]';
  
  // Selectors for filters
  addressFilter = 'input[placeholder*="Address"]';
  minPriceFilter = 'input[placeholder*="Min Price"]';
  maxPriceFilter = 'input[placeholder*="Max Price"]';
  bedroomsFilter = 'input[placeholder*="Bedrooms"]';
  searchButton = 'button[aria-label="Search"]';
  
  // Selectors for Property Form
  addressInput = 'input[name="address"]';
  descriptionInput = 'textarea[name="description"]';
  priceInput = 'input[name="price"]';
  bedroomsInput = 'input[name="bedrooms"]';
  bathroomsInput = 'input[name="bathrooms"]';
  squareFootageInput = 'input[name="squareFootage"]';
  submitButton = 'button[type="submit"]';
  
  /**
   * Visit the property listing page
   */
  visitListing() {
    cy.visit('/properties');
    return this;
  }
  
  /**
   * Visit the new property form
   */
  visitNewPropertyForm() {
    cy.visit('/properties/new');
    return this;
  }
  
  /**
   * Visit the edit property form for a specific property
   */
  visitEditPropertyForm(id: number) {
    cy.visit(`/properties/edit/${id}`);
    return this;
  }
  
  /**
   * Visit the property details page for a specific property
   */
  visitPropertyDetails(id: number) {
    cy.visit(`/properties/${id}`);
    return this;
  }
  
  /**
   * Click the add property button
   */
  clickAddProperty() {
    cy.get(this.addPropertyButton).click();
    return this;
  }
  
  /**
   * Filter properties by address
   */
  filterByAddress(address: string) {
    cy.get(this.addressFilter).clear().type(address);
    cy.get(this.searchButton).click();
    return this;
  }
  
  /**
   * Filter properties by price range
   */
  filterByPriceRange(min: number, max: number) {
    cy.get(this.minPriceFilter).clear().type(min.toString());
    cy.get(this.maxPriceFilter).clear().type(max.toString());
    cy.get(this.searchButton).click();
    return this;
  }
  
  /**
   * Fill out the property form
   */
  fillPropertyForm(property: {
    address: string;
    description: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
  }) {
    cy.get(this.addressInput).clear().type(property.address);
    cy.get(this.descriptionInput).clear().type(property.description);
    cy.get(this.priceInput).clear().type(property.price.toString());
    cy.get(this.bedroomsInput).clear().type(property.bedrooms.toString());
    cy.get(this.bathroomsInput).clear().type(property.bathrooms.toString());
    cy.get(this.squareFootageInput).clear().type(property.squareFootage.toString());
    return this;
  }
  
  /**
   * Submit the property form
   */
  submitForm() {
    cy.get(this.submitButton).click();
    return this;
  }
  
  /**
   * Delete a property by address
   */
  deletePropertyByAddress(address: string) {
    cy.contains(this.propertyAddress, address)
      .closest(this.propertyCard)
      .find(this.deleteButton)
      .click();
      
    cy.get(this.confirmDeleteButton).click();
    return this;
  }
}

// Export a singleton instance
export const propertyPage = new PropertyPage(); 