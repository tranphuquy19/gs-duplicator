export const css = `
.separator {
  display: flex;
  align-items: center;
  text-align: center;
	color: #737278;
	font-size: 0.9rem;
	font-weight: 500;
	margin: 2rem 0 0.2rem 0;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px dashed #737278;
}

.separator:not(:empty)::before {
  margin-right: .5em;
}

.separator:not(:empty)::after {
  margin-left: .5em;
}

.modal-body label {
	webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: -moz-none;
	-o-user-select: none;
	user-select: none;
}

`;
