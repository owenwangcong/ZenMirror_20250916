# Product Description Parser & Requirements Extraction System

## Overview
The product description document (`raw/product_description.txt`) is the **single source of truth** for the entire campaign. Every subagent must parse, extract, and validate against this document to ensure all ideas, insights, and requirements are implemented.

## Structured Extraction Framework

### 1. Requirements Extraction Template
Every subagent must first extract and structure requirements from the product description:

```python
class ProductDescriptionParser:
    def __init__(self, description_path="raw/product_description.txt"):
        self.raw_content = self.read_file(description_path)
        self.requirements = self.extract_all_requirements()
    
    def extract_all_requirements(self):
        return {
            "product_specs": self.extract_product_specifications(),
            "target_audience": self.extract_audience_requirements(),
            "unique_features": self.extract_unique_selling_points(),
            "messaging_guidelines": self.extract_messaging_requirements(),
            "visual_requirements": self.extract_visual_specifications(),
            "technical_constraints": self.extract_technical_requirements(),
            "business_goals": self.extract_business_objectives(),
            "compliance_requirements": self.extract_compliance_needs(),
            "timeline_requirements": self.extract_timeline_constraints(),
            "budget_constraints": self.extract_budget_limitations(),
            "success_metrics": self.extract_success_criteria(),
            "risk_factors": self.extract_identified_risks(),
            "competitor_insights": self.extract_competitive_analysis(),
            "customer_pain_points": self.extract_problem_statements(),
            "solution_benefits": self.extract_benefit_claims(),
            "proof_points": self.extract_evidence_claims(),
            "brand_guidelines": self.extract_brand_requirements(),
            "platform_requirements": self.extract_platform_specific_needs()
        }
```

### 2. Requirement Types to Extract

#### A. Explicit Requirements (Direct Statements)
```python
def extract_explicit_requirements(self, text):
    """Extract requirements explicitly stated with keywords"""
    patterns = [
        r"must\s+(.+?)(?:\.|,|;|$)",
        r"should\s+(.+?)(?:\.|,|;|$)",
        r"requires?\s+(.+?)(?:\.|,|;|$)",
        r"needs?\s+(.+?)(?:\.|,|;|$)",
        r"essential(?:ly)?\s+(.+?)(?:\.|,|;|$)",
        r"critical(?:ly)?\s+(.+?)(?:\.|,|;|$)",
        r"important(?:ly)?\s+(.+?)(?:\.|,|;|$)",
        r"ensure\s+(.+?)(?:\.|,|;|$)",
        r"guarantee\s+(.+?)(?:\.|,|;|$)"
    ]
    requirements = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        requirements.extend(matches)
    return requirements
```

#### B. Implicit Requirements (Derived from Context)
```python
def extract_implicit_requirements(self, text):
    """Extract requirements implied by context and descriptions"""
    implications = {
        "premium": ["high-quality materials", "superior finish", "attention to detail"],
        "eco-friendly": ["sustainable materials", "carbon footprint data", "recycling info"],
        "professional": ["enterprise features", "security", "reliability", "support"],
        "innovative": ["unique features", "patents", "first-to-market", "cutting-edge"],
        "affordable": ["value messaging", "comparison charts", "payment plans"],
        "user-friendly": ["simple setup", "intuitive UI", "clear instructions", "support"]
    }
    
    found_requirements = []
    for keyword, requirements in implications.items():
        if keyword.lower() in text.lower():
            found_requirements.extend(requirements)
    return found_requirements
```

#### C. Numerical Requirements (Specifications)
```python
def extract_numerical_requirements(self, text):
    """Extract all numerical specifications and constraints"""
    specs = {}
    
    # Price points
    price_pattern = r"\$?([\d,]+(?:\.\d{2})?)\s*(?:USD|dollars?|€|£)?"
    prices = re.findall(price_pattern, text)
    if prices:
        specs["pricing"] = prices
    
    # Percentages (discounts, improvements, etc.)
    percentage_pattern = r"(\d+(?:\.\d+)?)\s*%"
    percentages = re.findall(percentage_pattern, text)
    if percentages:
        specs["percentages"] = percentages
    
    # Dimensions, weights, quantities
    measurement_pattern = r"(\d+(?:\.\d+)?)\s*(mm|cm|m|inches?|feet|lbs?|kg|g|oz)"
    measurements = re.findall(measurement_pattern, text)
    if measurements:
        specs["measurements"] = measurements
    
    # Time constraints
    time_pattern = r"(\d+)\s*(hours?|days?|weeks?|months?)"
    times = re.findall(time_pattern, text)
    if times:
        specs["timelines"] = times
    
    return specs
```

### 3. Requirements Validation System

Each subagent must validate their outputs against extracted requirements:

```python
class RequirementsValidator:
    def __init__(self, requirements_dict):
        self.requirements = requirements_dict
        self.validation_report = {}
    
    def validate_output(self, agent_name, agent_output):
        """Validate that agent output meets requirements"""
        validation_results = {
            "met_requirements": [],
            "missed_requirements": [],
            "partially_met": [],
            "compliance_score": 0
        }
        
        # Check each requirement category relevant to this agent
        relevant_reqs = self.get_relevant_requirements(agent_name)
        
        for req_category, requirements in relevant_reqs.items():
            for requirement in requirements:
                status = self.check_requirement_met(requirement, agent_output)
                if status == "met":
                    validation_results["met_requirements"].append(requirement)
                elif status == "partial":
                    validation_results["partially_met"].append(requirement)
                else:
                    validation_results["missed_requirements"].append(requirement)
        
        # Calculate compliance score
        total = len(validation_results["met_requirements"]) + \
                len(validation_results["partially_met"]) * 0.5
        possible = sum(len(reqs) for reqs in relevant_reqs.values())
        validation_results["compliance_score"] = (total / possible) * 100 if possible > 0 else 0
        
        return validation_results
```

### 4. Updated Subagent Structure

All subagents must now follow this enhanced pattern:

```python
# Enhanced subagent template with requirements extraction
class EnhancedSubAgent:
    def __init__(self):
        # STEP 1: Parse product description first
        self.parser = ProductDescriptionParser()
        self.requirements = self.parser.extract_all_requirements()
        self.validator = RequirementsValidator(self.requirements)
        
    def execute(self):
        # STEP 2: Plan based on requirements
        plan = self.create_plan_from_requirements()
        
        # STEP 3: Execute with requirements in mind
        output = self.execute_with_requirements(plan)
        
        # STEP 4: Validate against requirements
        validation = self.validator.validate_output(self.name, output)
        
        # STEP 5: Iterate if compliance is low
        while validation["compliance_score"] < 90:
            output = self.improve_output(output, validation["missed_requirements"])
            validation = self.validator.validate_output(self.name, output)
        