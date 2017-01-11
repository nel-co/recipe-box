import React from 'react';
import './App.css';

const hide = { display: 'none' }
const show = { display: 'block' }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      deletedRecipes: [],
      nameValue: '',
      instructionsValue: '',
      showForm: true
    }
  }
  componentWillMount = () => {
    this.getLocalRecipes();
  }
  getLocalRecipes = () => {
    let rJSON = JSON.parse(localStorage.getItem("_nelco_recipes"));
    this.setState({
      recipes: rJSON
    });
    if (!rJSON) {
      this.setState({
        recipes: []
      });
    }
  }
  saveLocalRecipes = () => {
    let rString = JSON.stringify(this.state.recipes);
    localStorage.setItem("_nelco_recipes", rString);
  }
  removeRecipe = (e) => {
    let eIndex = e.currentTarget.parentElement.dataset.id;
    this.setState({
      deletedRecipes: this.state.recipes.splice(eIndex,1)
    });
    let rJSON = JSON.parse(localStorage.getItem("_nelco_recipes"));
    for (var i = 0; i < rJSON.length; i++) {
      if (rJSON[i] === eIndex) {
        rJSON.splice(i,1);
      }
    }
    this.saveLocalRecipes();
  }
  toggleInstructions = (e) => {
    let rb = e.currentTarget.querySelector('.instructions');
    rb.style.display === 'none' ? rb.style.display = 'block' : rb.style.display = 'none';
    let expand = e.currentTarget.querySelector('.expand');
    expand.classList.toggle('ex-rotate');
  }
  toggleForm = () => {
    this.setState({ showForm: !this.state.showForm });
    // toggles the form
    let fc = document.querySelector('.form-container');
    this.state.showForm ? fc.style.display = 'block' : fc.style.display = 'none';
    // toggles the recipes
    let rb = document.getElementById('boxes');
    this.state.showForm ? rb.style.display = 'none' : rb.style.display = 'block';
    // toggle add/cancel text
    let add = document.querySelector('.add-new');
    this.state.showForm ? add.innerHTML = 'Cancel' : add.innerHTML = 'Add Recipe';
  }
  handleRecipe = (e) => {
    this.addRecipe(e);
  }
  addRecipe = (e) => {
    e.preventDefault();
    if (this.state.nameValue !== '' && this.state.instructionsValue !== '') {
      let recArr = this.state.recipes;
      recArr.push( { name: this.state.nameValue, instructions: this.state.instructionsValue } );
      this.toggleForm();
      this.setState({
        recipes: recArr,
      });
    } else {
      this.editRecipe()
    }
    this.setState({
      nameValue: '',
      instructionsValue: '',
    });
    this.saveLocalRecipes();
    document.querySelector('input').value = '';
    document.querySelector('textarea').value = '';
  }
  editRecipe = (e) => {
    e.preventDefault();
    this.toggleForm();
    document.querySelector('input').value = e.currentTarget.parentElement.previousSibling.dataset.name;
    document.querySelector('textarea').value = e.currentTarget.parentElement.dataset.instr;
    let thisRecipe = e.currentTarget.parentElement.dataset.id;
    let recArr = this.state.recipes;
    recArr[thisRecipe] = { name: this.state.nameValue, instructions: this.state.instructionsValue }
    this.setState({
      nameValue: e.currentTarget.parentElement.previousSibling.dataset.name,
      instructionsValue: e.currentTarget.parentElement.dataset.instr,
      recipes: recArr,
      deletedRecipes: this.state.recipes.splice(thisRecipe,1)
    });
    this.saveLocalRecipes();
  }
  handelName = (e) => { this.setState({ nameValue: e.target.value }) }
  handleInstruction = (e) => { this.setState({ instructionsValue: e.target.value }) }

  render() {
    return (
      <main className="content">
        <Header
          toggleForm={this.toggleForm}
          showForm={this.state.showForm}
        />
        <RecipeBox
          recipeArr={this.state.recipes}
          toggleInstructions={this.toggleInstructions}
          removeRecipe={this.removeRecipe}
          toggleForm={this.toggleForm}
          nameValue={this.state.nameValue}
          instructionsValue={this.state.instructionsValue}
          editRecipe={this.editRecipe}
        />
        <RecipeForm
          recipeArr={this.state.recipes}
          handleRecipe={this.handleRecipe}
          handelName={this.handelName}
          handleInstruction={this.handleInstruction}
        />
      </main>
    )
  }
}
class RecipeBox extends React.Component {
  render() {
    const box = this.props.recipeArr.map( (r,index) => {
      return (
        <section className="recipe-box" key={index} onClick={ this.props.toggleInstructions }>
						<div className="info" data-name={r.name}>
							<div className="title"> { r.name } </div>
							<div className="expand">
                <i className="fa fa-angle-right" aria-hidden="true"></i>
              </div>
						</div>
          <div className="instructions" data-id={index} data-instr={r.instructions} style={ hide }>
            { r.instructions }
            <br />
            <span style={{ color: '#1d1d1d', float: 'right' }} className="edit" onClick={this.props.removeRecipe}><i className="fa fa-trash-o" aria-hidden="true"></i></span>
            <span className="edit" onClick={this.props.editRecipe}><i className="fa fa-pencil" aria-hidden="true"></i></span>
					</div>
			</section>
      )
    });
    return (
      <main className="content">
        <span id='boxes'> { box } </span>
      </main>
    )
  }
}
class RecipeForm extends React.Component {
  render() {
    return(
      <div className="form-container">
				<form onSubmit={this.props.handleRecipe}>
					<input type="text" name="recipe-name" placeholder="Recipe Name" onChange={this.props.handelName} value={this.props.nameValue}/>
					<textarea name="recipe-inst" placeholder="Recipe Instuctions" onChange={this.props.handleInstruction} value={this.props.instructionsValue}></textarea>
					<button className="save" type="submit">Save</button>
				</form>
			</div>
    )
  }
}
class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <h2 className="logo">Recipe <span className="light">Box</span></h2>
        <span className="add-new" onClick={this.props.toggleForm}>Add Recipe</span>
      </div>
    );
  }
}

export default App;
