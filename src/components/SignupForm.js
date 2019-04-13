import React, { useState } from 'react';
import { FormGroup } from './FormGroup.js';

export function SignupForm() {
	const [values, setValues] = useState({
		name: 'Bob',
		fruits: ['banana', 'apple'],
	});

	return (
		<FormGroup values={values} onUpdate={setValues}>
			<table>
				<tbody>
					<tr>
						<th>Name</th>
						<td>
							<input name="name" type="text" />
						</td>
					</tr>
					<tr>
						<th>Email</th>
						<td>
							<input name="address" type="email" />
						</td>
					</tr>
					<tr>
						<th>Fruits</th>
						<td>
							<label>
								<input
									name="fruits"
									type="checkbox"
									value="banana"
								/>
								<span className="checkable">Banana</span>
							</label>
							<br />
							<label>
								<input
									name="fruits"
									type="checkbox"
									value="strawberry"
								/>
								<span className="checkable">Strawberry</span>
							</label>
							<br />
							<label>
								<input
									name="fruits"
									type="checkbox"
									value="apple"
								/>
								<span className="checkable">Apple</span>
							</label>
							<br />
						</td>
					</tr>
					<tr>
						<th>Slices</th>
						<td>
							<select name="slices">
								<option value="">Choose one</option>
								<option value="longways">Longways</option>
								<option value="crossways">Crossways</option>
								<option value="diced">Diced</option>
							</select>
						</td>
					</tr>
					<tr>
						<th>Garnishes</th>
						<td>
							<select name="garnishes" multiple>
								<option value="nuts">Nuts</option>
								<option value="granolla">Granolla</option>
								<option value="yogurt">Yogurt</option>
								<option value="oats">Oats</option>
							</select>
						</td>
					</tr>
					<tr>
						<th>Delivery Instructions</th>
						<td>
							<textarea name="delivery" />
						</td>
					</tr>
				</tbody>
			</table>
			<h2>Form values</h2>
			<pre>{JSON.stringify(values, null, 4)}</pre>
		</FormGroup>
	);
}
