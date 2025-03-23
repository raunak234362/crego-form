import Form from "@rjsf/core";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { Tabs, Box, Button } from "@chakra-ui/react";

import "./BusinessForm.css";

const businessSchema: RJSFSchema = {
  type: "object",
  title: "Business Details",
  properties: {
    businessName: {
      type: "string",
      title: "Business Name",
    },
    gstin: {
      type: "string",
      title: "GSTIN",
      pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$",
      // Custom error message for invalid GSTIN can be handled in the onError handler
    },
    directors: {
      type: "array",
      title: "Directors",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "Director Name",
          },
          panNumber: {
            type: "string",
            title: "PAN Number",
            // pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
            // "errorMessage": "Invalid PAN format"
          },
          tags: {
            type: "array",
            title: "Roles",
            items: { type: "string" },
          },
        },
      },
    },
  },
};

const loanSchema: RJSFSchema = {
  type: "object",
  title: "Loan Details",
  properties: {
    creditScore: {
      type: "number",
      title: "Credit Score",
      minimum: 300,
      maximum: 900,
    },
    loanAmount: {
      type: "number",
      title: "Required Loan Amount",
      minimum: 50000,
      maximum: 500000,
    },
  },
  dependencies: {
    creditScore: {
      oneOf: [
        {
          properties: {
            creditScore: { minimum: 700 },
          },
        },
        {
          properties: {
            creditScore: { maximum: 699 },
            guarantors: {
              type: "array",
              title: "Guarantors",
              minItems: 2,
              items: {
                type: "object",
                properties: {
                  name: { type: "string", title: "Name" },
                  panNumber: {
                    type: "string",
                    title: "PAN Number",
                    // pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
                    // "errorMessage": "Invalid PAN format"
                  },
                  relationship: {
                    type: "string",
                    title: "Relationship with Applicant",
                    enum: [
                      "Father",
                      "Mother",
                      "Brother",
                      "Sister",
                      "Spouse",
                      "Other",
                    ],
                  },
                  relation: {
                    type: "string",
                    title: "Specify Relation",
                    dependencies: {
                      relationship: {
                        oneOf: [
                          {
                            properties: {
                              relationship: { enum: ["Other"] },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
            bankStatement: {
              type: "array",
              title: "Bank Statements",
              items: {
                type: "string",
                format: "data-url",
              },
            },
          },
        },
      ],
    },
  },
};


const uiSchema: UiSchema = {
  businessDetails: {
    directors: {
      "ui:options": {
        addButtonText: "Add Director", // Set the label for the add button
        addable: true, // Allow adding new directors
        removable: true, // Allow removing directors
        orderable: true, // Allow reordering directors
      },
      items: {
        name: {
          "ui:placeholder": "Enter Director Name",
        },
        panNumber: {
          "ui:placeholder": "Enter PAN Number",
        },
        tags: {
          "ui:widget": "checkboxes",
        },
      },
    },
  },
};

export default function BusinessForm() {
  return (
    <Box className="container" bg="gray.500" h="100vh" display="flex" flexDirection="column" alignItems="center">
      <h1 >Business Loan Form</h1>
      <Box p="8" borderWidth="3px" borderRadius="lg" bg="white" flex="auto" justifyContent="center" h="1/2" w="1/2" mx="30px">
        <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
          {/* Tab Headers */}
          <Tabs.List gap="5">
            <Tabs.Trigger value="tab-1" bg="blue.400">Business Details</Tabs.Trigger>
            <Tabs.Trigger value="tab-2" bg="blue.400">Loan Details</Tabs.Trigger>
          </Tabs.List>

          {/* Tab Content */}

          <Tabs.Content value="tab-1">
            <Form
              schema={businessSchema}
              validator={validator}
              uiSchema={uiSchema}
              onSubmit={(data) => {
                console.log("Form submitted with data:", data.formData);
              }}
              onError={(errors) => {
                console.error("Form validation errors:", errors);
              }}
            >
              <Box className="form-buttons" gap="5" display="flex" justifyContent="center">
                <Button bg="green.500" color="white" py="2" px="4" rounded="md" type="submit" className="submit-button">
                  Submit
                </Button>
                <Button
                  bg="red.500"
                  color="white"
                  py="2"
                  px="4"
                  rounded="md"
                  className="cancel-button"
                  onClick={() => console.log("Cancel button clicked")}
                >
                  Cancel
                </Button>
              </Box>
            </Form>
          </Tabs.Content>

          <Tabs.Content value="tab-2">
            <Form schema={loanSchema} validator={validator}>
              
              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  Submit
                </button>
                <button type="button" className="cancel-button">
                  Cancel
                </button>
              </div>
            </Form>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Box>
  );
}
