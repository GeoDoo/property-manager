import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { expect } from "chai";
import { screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

interface CustomWorld {
  navigateTo(path: string): Promise<void>;
  getCurrentPath(): string;
}

Given("I am on the property list page", async function (this: CustomWorld) {
  await this.navigateTo("/");
  await waitFor(() => {
    const heading = screen.getByRole('heading', { 
      level: 1,
      name: /properties/i 
    });
    expect(heading).to.exist;
    expect(this.getCurrentPath()).to.equal('/');
  });
});

When(
  "I click the {string} button",
  async function (this: CustomWorld, buttonText: string) {
    const button = screen.getByRole('button', { name: buttonText });
    await userEvent.click(button);
  }
);

Then(
  "I should be redirected to the add property form",
  async function (this: CustomWorld) {
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /add new property/i });
      expect(heading).to.exist;
      expect(this.getCurrentPath()).to.equal('/property/new');
    }, { timeout: 2000 });
  }
);

When(
  "I fill in the following property details:",
  async function (this: CustomWorld, dataTable: DataTable) {
    const formData = dataTable.rowsHash();

    for (const [field, value] of Object.entries(formData)) {
      const input = screen.getByLabelText(field);
      await userEvent.clear(input);
      await userEvent.type(input, String(value));
    }
  }
);

Then(
  "I should see a success message {string}",
  async function (this: CustomWorld, message: string) {
    const alert = await waitFor(() => screen.getByRole('alert'));
    expect(alert.textContent).to.include(message);
  }
);

Then(
  "I should be redirected to the property list page",
  async function (this: CustomWorld) {
    await waitFor(() => {
      const heading = screen.getByRole('heading', { 
        level: 1,
        name: /properties/i 
      });
      expect(heading).to.exist;
      expect(this.getCurrentPath()).to.equal("/");
    });
  }
);

Then(
  "I should see the new property in the list",
  async function (this: CustomWorld) {
    const propertyList = screen.getByRole('list');
    const properties = within(propertyList).getAllByRole('listitem');
    const property = properties.find(item => 
      item.textContent?.includes('123 Test Street') &&
      item.textContent?.includes('Test City')
    );
    expect(property).to.exist;
  }
);

Then(
  "I should see validation errors:",
  async function (this: CustomWorld, dataTable: DataTable) {
    const errors = dataTable.rowsHash();

    for (const [field, error] of Object.entries(errors)) {
      const errorMessage = await waitFor(() => screen.getByText(String(error)));
      expect(errorMessage).to.exist;
    }
  }
);
